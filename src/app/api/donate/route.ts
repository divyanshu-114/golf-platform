import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { charity_id, amount, charity_name } = await req.json()

  if (!amount || amount < 1)
    return NextResponse.json({ error: 'Minimum donation is £1' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: user?.email,
    line_items: [{
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(amount * 100),
        product_data: { name: `Donation to ${charity_name}` }
      },
      quantity: 1
    }],
    metadata: {
      type: 'donation',
      charity_id,
      user_id: user?.id ?? 'guest',
      amount
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/charities/${charity_id}?donated=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/charities/${charity_id}`,
  })

  return NextResponse.json({ url: session.url })
}