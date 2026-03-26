import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getAuthUser } from '@/lib/supabase/admin'

// GET — fetch user's scores
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_on', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scores: data })
}

// POST — add new score
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { score, played_on } = await req.json()

  if (!score || score < 1 || score > 45)
    return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
  if (!played_on)
    return NextResponse.json({ error: 'Date is required' }, { status: 400 })

  // Check current count of scores
  const { data: existing } = await supabaseAdmin
    .from('scores')
    .select('id, played_on')
    .eq('user_id', user.id)
    .order('played_on', { ascending: true })

  // If already 5 scores, delete the oldest
  if (existing && existing.length >= 5) {
    await supabaseAdmin.from('scores').delete().eq('id', existing[0].id)
  }

  const { error } = await supabaseAdmin.from('scores').insert({
    user_id: user.id,
    score,
    played_on,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}