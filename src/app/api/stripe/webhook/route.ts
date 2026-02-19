import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    if (!userId || !supabaseAdmin) return NextResponse.json({ ok: true });

    await supabaseAdmin.from('users').update({
      is_pinnacle: true,
      premium_since: new Date().toISOString(),
      stripe_customer_id: session.customer as string | null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string | null,
      updated_at: new Date().toISOString(),
    }).eq('id', userId);
  }

  return NextResponse.json({ ok: true });
}
