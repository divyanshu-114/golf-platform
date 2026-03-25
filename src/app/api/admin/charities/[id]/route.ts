import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireAdmin()
  if (error) return error
  const body = await req.json()
  await supabase!.from('charities').update(body).eq('id', id)
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireAdmin()
  if (error) return error
  await supabase!.from('charities').delete().eq('id', id)
  return NextResponse.json({ success: true })
}