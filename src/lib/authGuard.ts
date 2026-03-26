import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function requireAuth() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const tokenCookies = allCookies
    .filter(c => c.name.includes('auth-token'))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (tokenCookies.length === 0) return null

  const fullToken = tokenCookies.map(c => c.value).join('')
  
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
      return user?.id ?? null
    }
  } catch {
    return null
  }
  return null
}
