import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Use service role here — webhook runs outside user session
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const plan = session.metadata?.plan
    const stripeSubId = session.subscription as string

    // Fetch renewal date from Stripe
    const sub = await stripe.subscriptions.retrieve(stripeSubId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renewalDate = new Date((sub as any).current_period_end * 1000).toISOString()

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: stripeSubId,
      plan,
      status: 'active',
      renewal_date: renewalDate,
    }, { onConflict: 'user_id' })

    if (session.metadata?.type === 'donation') {
      await supabase.from('donations').insert({
        user_id: session.metadata.user_id === 'guest' ? null : session.metadata.user_id,
        charity_id: session.metadata.charity_id,
        amount: parseFloat(session.metadata.amount),
        stripe_payment_id: session.payment_intent as string,
        status: 'completed'
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    await supabase
      .from('subscriptions')
      .update({ status: 'lapsed' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .eq('stripe_subscription_id', (invoice as any).subscription as string)
  }

  return NextResponse.json({ received: true })
}