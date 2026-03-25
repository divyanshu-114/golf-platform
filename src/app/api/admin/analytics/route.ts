import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const [users, activeSubs, draws, winners, charities] = await Promise.all([
    supabase!.from('profiles').select('*', { count: 'exact', head: true }),
    supabase!.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase!.from('draws').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase!.from('winners').select('prize_amount'),
    supabase!.from('profiles').select('charity_contribution_pct, subscriptions!inner(status)')
      .eq('subscriptions.status', 'active')
  ])

  const totalPrizesPaid = winners.data?.reduce((sum, w) => sum + w.prize_amount, 0) ?? 0
  const avgCharityPct = charities.data?.length
    ? charities.data.reduce((sum, p) => sum + (p.charity_contribution_pct ?? 10), 0) / charities.data.length
    : 10
  const estimatedCharityPool = (activeSubs.count ?? 0) * 9.99 * (avgCharityPct / 100)

  return NextResponse.json({
    totalUsers: users.count ?? 0,
    activeSubscribers: activeSubs.count ?? 0,
    totalDraws: draws.count ?? 0,
    totalPrizesPaid,
    estimatedCharityPool: parseFloat(estimatedCharityPool.toFixed(2)),
    avgCharityPct: parseFloat(avgCharityPct.toFixed(1))
  })
}