import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { email, password, fullName } = await req.json()

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (typeof email !== 'string' || typeof password !== 'string' || typeof fullName !== 'string') {
    return NextResponse.json({ error: 'Invalid signup payload' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      message: 'Check your email to confirm your account before logging in.',
    },
    { status: 201 }
  )
}
