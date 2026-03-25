import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateRandomNumbers,
  generateAlgorithmicNumbers,
  resolveWinners,
  calculatePrizePools
} from '@/lib/drawEngine'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { draw_id, mode } = await req.json()

  const { data: entries } = await supabase
    .from('draw_entries').select('user_id, numbers').eq('draw_id', draw_id)

  const { data: allScores } = await supabase.from('scores').select('score')

  const winningNumbers = mode === 'algorithmic'
    ? generateAlgorithmicNumbers(allScores ?? [])
    : generateRandomNumbers()

  const winners = resolveWinners(entries ?? [], winningNumbers)

  const { count } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { data: draw } = await supabase
    .from('draws').select('jackpot_rollover').eq('id', draw_id).single()

  const pools = calculatePrizePools(count ?? 0, 5, draw?.jackpot_rollover ?? 0)

  // Save winners to DB
  for (const [tier, userIds] of Object.entries(winners)) {
    const tierNum = parseInt(tier)
    if (userIds.length === 0) continue

    const poolForTier = tierNum === 5 ? pools.tier5
      : tierNum === 4 ? pools.tier4 : pools.tier3

    const prizePerWinner = parseFloat((poolForTier / userIds.length).toFixed(2))

    for (const user_id of userIds) {
      await supabase.from('winners').insert({
        draw_id,
        user_id,
        tier: tierNum,
        prize_amount: prizePerWinner
      })
    }
  }

  // Handle jackpot rollover if no 5-match winner
  const jackpotRollover = winners[5].length === 0 ? pools.tier5 : 0

  // Save prize pool record
  await supabase.from('prize_pools').insert({
    draw_id,
    total_pool: pools.totalPool,
    tier_5: pools.tier5,
    tier_4: pools.tier4,
    tier_3: pools.tier3,
    jackpot_rollover: jackpotRollover
  })

  // Update draw status & winning numbers
  await supabase.from('draws').update({
    winning_numbers: winningNumbers,
    status: 'published',
    jackpot_rollover: jackpotRollover,
    published_at: new Date().toISOString()
  }).eq('id', draw_id)

  return NextResponse.json({
    winningNumbers,
    winners,
    pools,
    jackpotRollover,
    published: true
  })
}