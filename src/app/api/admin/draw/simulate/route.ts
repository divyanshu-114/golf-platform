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

  // Fetch entries
  const { data: entries } = await supabase
    .from('draw_entries')
    .select('user_id, numbers')
    .eq('draw_id', draw_id)

  // Fetch all scores for algorithmic mode
  const { data: allScores } = await supabase
    .from('scores').select('score')

  const winningNumbers = mode === 'algorithmic'
    ? generateAlgorithmicNumbers(allScores ?? [])
    : generateRandomNumbers()

  const winners = resolveWinners(entries ?? [], winningNumbers)

  // Fetch active subscriber count for prize pool
  const { count } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Fetch existing jackpot rollover
  const { data: draw } = await supabase
    .from('draws').select('jackpot_rollover').eq('id', draw_id).single()

  const pools = calculatePrizePools(count ?? 0, 5, draw?.jackpot_rollover ?? 0)

  return NextResponse.json({
    winningNumbers,
    winners,
    pools,
    simulation: true // flag — not saved
  })
}