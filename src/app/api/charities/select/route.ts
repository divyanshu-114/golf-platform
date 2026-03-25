import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { charity_id, contribution_pct } = await req.json()

  if (contribution_pct < 10 || contribution_pct > 100)
    return NextResponse.json({ error: 'Contribution must be between 10% and 100%' }, { status: 400 })

  await supabase.from('profiles').update({
    charity_id,
    charity_contribution_pct: contribution_pct
  }).eq('id', user.id)

  return NextResponse.json({ success: true })
}