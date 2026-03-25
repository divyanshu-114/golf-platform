import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single()

  if (!sub) return NextResponse.json({ error: 'No subscription found' }, { status: 404 })

  // Cancel at period end — user keeps access until renewal date
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true
  })

  return NextResponse.json({ success: true })
}
