import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getAuthUser } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { charity_id, contribution_pct } = await req.json()

  if (contribution_pct < 10 || contribution_pct > 100)
    return NextResponse.json({ error: 'Contribution must be between 10% and 100%' }, { status: 400 })

  const { error } = await supabaseAdmin.from('profiles').update({
    charity_id,
    charity_contribution_pct: contribution_pct
  }).eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}