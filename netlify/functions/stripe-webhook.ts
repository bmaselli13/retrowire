/* Netlify Function: Stripe Webhook (auto-upgrade user to Pro)
   IMPORTANT: Configure environment variables in Netlify:
     - STRIPE_SECRET_KEY       = sk_live_...            (not used here but often kept for server usage)
     - STRIPE_WEBHOOK_SECRET   = whsec_...              (from Stripe Dashboard for this endpoint)
     - FIREBASE_PROJECT_ID     = your-project-id
     - FIREBASE_CLIENT_EMAIL   = service-account@...gserviceaccount.com
     - FIREBASE_PRIVATE_KEY    = -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
       (Paste exactly as provided; if Netlify strips newlines, replace '\n' sequences in code below)

   Notes:
   - This webhook listens for checkout.session.completed events.
   - It upgrades the user in Firestore by matching session.customer_email to a user profile.
   - For Payment Links, session.client_reference_id is typically unavailable; email match is used.
   - Harden later by validating the purchased product/price via Stripe (retrieve session line items).
*/
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Stripe-Signature',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

let appInitialized = false;
function initFirebaseAdmin() {
  if (appInitialized) return;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin env vars missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
    return;
  }

  // Handle escaped newlines if necessary
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  appInitialized = true;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_WEBHOOK_SECRET) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server is not configured with STRIPE_WEBHOOK_SECRET' }),
    };
  }
  if (!STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY not set; not required for webhook verification but recommended.');
  }

  // Prepare raw body for signature verification
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const isBase64 = event.isBase64Encoded;
  const rawBody = isBase64 ? Buffer.from(event.body || '', 'base64') : Buffer.from(event.body || '');

  let stripe: Stripe;
  try {
    stripe = new Stripe(STRIPE_SECRET_KEY || 'sk_test_dummy', { apiVersion: '2024-04-10' });
  } catch (e: any) {
    console.error('Failed to init Stripe:', e);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Stripe init failed' }) };
  }

  let eventObj: Stripe.Event;
  try {
    eventObj = stripe.webhooks.constructEvent(rawBody, sig as string, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err?.message || err);
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  // Process event
  try {
    switch (eventObj.type) {
      case 'checkout.session.completed': {
        const session = eventObj.data.object as Stripe.Checkout.Session;
        const mode = session.mode; // 'subscription' or 'payment'

        // Prefer the email directly from the session
        let email: string | null = session.customer_email || null;

        // If missing (common with Payment Links), try retrieving the Customer
        if (!email && typeof session.customer === 'string') {
          try {
            const cust = await stripe.customers.retrieve(session.customer);
            if (!(cust as Stripe.DeletedCustomer).deleted) {
              email = (cust as Stripe.Customer).email || null;
            }
          } catch (e) {
            console.warn('Unable to retrieve Stripe customer for email:', e);
          }
        }

        if (!email) {
          console.warn('checkout.session.completed without resolvable customer email; skipping upgrade');
          break;
        }

        // TODO (hardening): Retrieve line items and validate the price/product corresponds to Pro plan.

        // Upgrade user in Firestore by email
        initFirebaseAdmin();
        if (!appInitialized) {
          console.error('Firebase Admin is not initialized - missing credentials');
          break;
        }
        const db = admin.firestore();

        const usersRef = db.collection('users');
        const snap = await usersRef.where('email', '==', email).limit(1).get();
        if (snap.empty) {
          console.warn(`No user profile found for email: ${email}`);
          break;
        }

        const docRef = snap.docs[0].ref;
        await docRef.update({
          subscription: {
            tier: 'pro',
            projectLimit: 9999,
          },
          lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Upgraded user ${email} to Pro.`);
        break;
      }

      // Potentially handle 'invoice.paid' for subscriptions renewals...
      default:
        // No-op for other events
        break;
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ received: true }) };
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err?.message || 'Webhook processing failed' }) };
  }
}
