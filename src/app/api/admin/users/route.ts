import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { data } = await supabase!
    .from('profiles')
    .select(`
      id, full_name, role, created_at,
      subscriptions (plan, status, renewal_date),
      scores (score, played_on)
    `)
    .order('created_at', { ascending: false })

  return NextResponse.json({ users: data })
}