import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireAdmin()
  if (error) return error

  const { verification_status, payout_status } = await req.json()
  await supabase!.from('winners')
    .update({ verification_status, payout_status })
    .eq('id', id)

  return NextResponse.json({ success: true })
}