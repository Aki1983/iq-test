import Stripe from "stripe";
import { getSql } from "@/lib/db";
import { PRICE_CENTS, PRICE_CURRENCY } from "@/lib/scoring";

let stripeClient: Stripe | null | undefined;

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  stripeClient ??= new Stripe(key);
  return stripeClient;
}

export async function markTestPaid(opts: {
  testId: string;
  userId: string;
  sessionId: string | null;
  paymentIntentId?: string | null;
}): Promise<boolean> {
  const sql = await getSql();
  const updated = await sql<{ id: string }>`
    update tests
    set paid = true,
        stripe_session_id = coalesce(${opts.sessionId}, stripe_session_id),
        stripe_payment_intent_id = coalesce(${opts.paymentIntentId ?? null}, stripe_payment_intent_id)
    where id = ${opts.testId}
      and user_id = ${opts.userId}
      and status = 'completed'
    returning id
  `;
  if (updated.length === 0) return false;

  if (opts.sessionId) {
    await sql`
      insert into payments (id, user_id, test_id, stripe_session_id, amount_cents, currency, status)
      values (
        ${crypto.randomUUID()},
        ${opts.userId},
        ${opts.testId},
        ${opts.sessionId},
        ${PRICE_CENTS},
        ${PRICE_CURRENCY},
        'succeeded'
      )
      on conflict (stripe_session_id) do update set status = 'succeeded'
    `;
  }
  return true;
}

export async function handleStripeWebhook(request: Request): Promise<Response> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !secret) {
    return new Response("Stripe is not configured", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return Response.json({ received: true });
    }
    const testId = session.metadata?.testId;
    const userId = session.metadata?.userId;
    if (!testId || !userId) {
      return new Response("Missing metadata", { status: 400 });
    }
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    await markTestPaid({
      testId,
      userId,
      sessionId: session.id,
      paymentIntentId: paymentIntent,
    });
  }

  return Response.json({ received: true });
}
