import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { data, error: dbError } = await supabase!
    .from('winners')
    .select('id, tier, prize_amount, verification_status, payout_status, proof_url, profiles(full_name), draws(month)')
    .order('created_at', { ascending: false })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ winners: data ?? [] })
}
