import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — fetch user's scores
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_on', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scores: data })
}

// POST — add new score (rolling logic via DB function)
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { score, played_on } = await req.json()

  // Validate
  if (!score || score < 1 || score > 45)
    return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
  if (!played_on)
    return NextResponse.json({ error: 'Date is required' }, { status: 400 })

  const { error } = await supabase.rpc('add_score', {
    p_user_id: user.id,
    p_score: score,
    p_played_on: played_on
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}