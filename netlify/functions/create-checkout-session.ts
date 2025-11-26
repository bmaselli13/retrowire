/* Netlify Function: Create Stripe Checkout Session
   IMPORTANT:
   - Do NOT hardcode your Stripe secret here.
   - Set environment variables in Netlify:
       STRIPE_SECRET_KEY = sk_live_...
       STRIPE_PRICE_ID   = price_xxx (recurring price for your Pro plan)
*/
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
};

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

  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const DEFAULT_PRICE_ID = process.env.STRIPE_PRICE_ID; // fallback if not provided by client
    if (!STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server is not configured with STRIPE_SECRET_KEY' }),
      };
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

    const body = JSON.parse(event.body || '{}');
    const {
      priceId,
      uid,
      email,
      successUrl, // optional override
      cancelUrl,  // optional override
      quantity = 1,
    } = body as {
      priceId?: string;
      uid?: string;
      email?: string;
      successUrl?: string;
      cancelUrl?: string;
      quantity?: number;
    };

    const schemeAndHost =
      (event.headers && (event.headers['x-forwarded-proto'] && event.headers['x-forwarded-host']))
        ? `${event.headers['x-forwarded-proto']}://${event.headers['x-forwarded-host']}`
        : (event.headers?.origin || event.headers?.referer?.split('/').slice(0, 3).join('/') || 'http://localhost:8888');

    const success_url =
      successUrl || `${schemeAndHost}/projects?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = cancelUrl || `${schemeAndHost}/projects?checkout=cancel`;

    const resolvedPriceId = priceId || DEFAULT_PRICE_ID;
    if (!resolvedPriceId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing priceId (client) and STRIPE_PRICE_ID (server)' }),
      };
    }

    // Create a subscription checkout session (Pro plan)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: uid, // helpful for post-checkout processing
      customer_email: email,    // prefill email
      line_items: [
        {
          price: resolvedPriceId,
          quantity,
        },
      ],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      // You can add metadata if needed:
      // metadata: { uid },
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err: any) {
    console.error('Stripe checkout session error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err?.message || 'Failed to create checkout session' }),
    };
  }
}
