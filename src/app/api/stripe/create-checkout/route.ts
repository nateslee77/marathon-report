import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.bungieMembershipId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings`,
    metadata: { supabase_user_id: session.user.bungieMembershipId },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
