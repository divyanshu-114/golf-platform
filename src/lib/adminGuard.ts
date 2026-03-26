import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export async function requireAdmin() {
  // Try to get the user from cookies
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const tokenCookies = allCookies
    .filter(c => c.name.includes('auth-token'))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (tokenCookies.length === 0)
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const fullToken = tokenCookies.map(c => c.value).join('')

  let userId: string | null = null
  try {
    let decoded = fullToken
    if (fullToken.startsWith('base64-')) {
      decoded = Buffer.from(fullToken.replace('base64-', ''), 'base64').toString('utf-8')
    } else {
      decoded = Buffer.from(fullToken, 'base64').toString('utf-8')
    }
    const session = JSON.parse(decoded)
    const jwt = session?.access_token
    if (jwt) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(jwt)
      userId = user?.id ?? null
    }
  } catch {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (!userId)
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (profile?.role !== 'admin')
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }

  return { user: { id: userId }, supabase: supabaseAdmin }
}