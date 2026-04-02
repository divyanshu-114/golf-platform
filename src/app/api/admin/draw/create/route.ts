import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function POST() {
  const { error: authError, supabase } = await requireAdmin()
  if (authError) return authError

  const month = new Date()
  month.setDate(1) // First of current month

  // Create draw record
  const { data: draw, error: dbError } = await supabase
    .from('draws')
    .insert({ month: month.toISOString(), status: 'pending' })
    .select().single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  // Snapshot all active subscribers' scores into draw_entries
  const { data: activeUsers } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')

  if (activeUsers && activeUsers.length > 0) {
    for (const { user_id } of activeUsers) {
      const { data: scores } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', user_id)
        .order('played_on', { ascending: false })
        .limit(5)

      if (scores && scores.length > 0) {
        const numbers = scores.map(s => s.score)
        await supabase.from('draw_entries').insert({
          draw_id: draw.id,
          user_id,
          numbers
        })
      }
    }
  }

  return NextResponse.json({ draw })
}