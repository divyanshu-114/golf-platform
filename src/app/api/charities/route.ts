import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use admin client to bypass RLS — charities are public data
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const featured = searchParams.get('featured')

  let query = supabaseAdmin
    .from('charities')
    .select(`*, charity_events(*)`)
    .order('is_featured', { ascending: false })
    .order('name')

  if (search) query = query.ilike('name', `%${search}%`)
  if (featured === 'true') query = query.eq('is_featured', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ charities: data })
}