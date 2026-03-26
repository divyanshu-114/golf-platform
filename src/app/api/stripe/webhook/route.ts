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

    console.log('[webhook] checkout session mode:', session.mode, 'subscription ID:', session.subscription)

    if (session.mode === 'subscription') {
      const plan = session.metadata?.plan
      const stripeSubId = session.subscription as string

      console.log('[webhook] processing subscription:', stripeSubId)

      try {
        // Fetch renewal date from Stripe
        const sub = await stripe.subscriptions.retrieve(stripeSubId)

        // The renewal date is now on the subscription item in recent Stripe API versions
        const currentPeriodEnd = sub.items?.data?.[0]?.current_period_end
        if (!currentPeriodEnd) throw new Error('Missing current_period_end on subscription item')
        
        const renewalDate = new Date(currentPeriodEnd * 1000).toISOString()

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()

        if (existingSub) {
          const { error: updateError } = await supabase.from('subscriptions').update({
            stripe_subscription_id: stripeSubId,
            plan,
            status: 'active',
            renewal_date: renewalDate,
          }).eq('user_id', userId)
          if (updateError) console.error('[webhook] DB Update Error:', updateError)
        } else {
          const { error: insertError } = await supabase.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: stripeSubId,
            plan,
            status: 'active',
            renewal_date: renewalDate,
          })
          if (insertError) console.error('[webhook] DB Insert Error:', insertError)
        }
        
        console.log('[webhook] upserted subscription for user:', userId)
      } catch (err) {
        console.error('[webhook] error processing subscription:', err)
      }
    }

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