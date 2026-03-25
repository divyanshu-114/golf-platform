import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { data } = await supabase!.from('charities').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ charities: data })
}

export async function POST(req: NextRequest) {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const { data, error: dbError } = await supabase!.from('charities').insert(body).select().single()
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ charity: data })
}