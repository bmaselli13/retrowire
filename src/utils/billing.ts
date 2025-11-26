export interface CreateCheckoutBody {
  uid?: string;
  email?: string;
  priceId?: string;
  successUrl?: string;
  cancelUrl?: string;
  quantity?: number;
}

interface CreateCheckoutResponse {
  id: string;
  url: string;
}

interface GetCheckoutResponse {
  id: string;
  status: string | null;
  mode: string | null;
  customer_email: string | null;
  subscriptionId?: string | null;
}

function functionsBase() {
  // Netlify Functions are mounted under /.netlify/functions in prod
  // Also works in Netlify dev (netlify dev) and during preview deploys
  return '/.netlify/functions';
}

export async function startCheckout(body: CreateCheckoutBody): Promise<CreateCheckoutResponse> {
  const res = await fetch(`${functionsBase()}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Failed to create checkout session (${res.status})`);
  }

  return (await res.json()) as CreateCheckoutResponse;
}

export async function verifyCheckout(sessionId: string): Promise<GetCheckoutResponse> {
  const res = await fetch(`${functionsBase()}/get-checkout-session?session_id=${encodeURIComponent(sessionId)}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || `Failed to verify checkout session (${res.status})`);
  }

  return (await res.json()) as GetCheckoutResponse;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
