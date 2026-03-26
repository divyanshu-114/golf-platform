import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getAuthUser } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [profile, subscription, scores, charity, winners] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').eq('id', user.id).single(),
    supabaseAdmin.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
    supabaseAdmin.from('scores').select('*').eq('user_id', user.id).order('played_on', { ascending: false }),
    supabaseAdmin.from('profiles').select('charity_id, charity_contribution_pct, charities(name)').eq('id', user.id).single(),
    supabaseAdmin.from('winners').select('*, draws(month)').eq('user_id', user.id).order('created_at', { ascending: false })
  ])

  return NextResponse.json({
    profile: profile.data,
    subscription: subscription.data,
    scores: scores.data ?? [],
    charity: charity.data,
    winners: winners.data ?? [],
  })
}
