/* Netlify Function: Get Stripe Checkout Session
   Purpose: Verify a checkout session on return to your site.
   Env required:
     STRIPE_SECRET_KEY = sk_live_...
*/
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,GET',
};

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Server is not configured with STRIPE_SECRET_KEY' }),
      };
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

    const session_id = event.queryStringParameters?.session_id;
    if (!session_id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing session_id' }),
      };
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription', 'payment_intent'],
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: session.id,
        status: session.status,
        mode: session.mode,
        customer_email: session.customer_email,
        subscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
      }),
    };
  } catch (err: any) {
    console.error('Stripe get checkout session error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err?.message || 'Failed to retrieve checkout session' }),
    };
  }
}
