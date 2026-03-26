import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Admin client bypasses RLS — use ONLY in server-side API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Extract and verify the authenticated user from a Next.js API request.
 * Reads the Supabase auth token from the Authorization header or cookies.
 * Returns the user object or null if not authenticated.
 */
export async function getAuthUser(req: NextRequest) {
  // 1. Check Authorization header FIRST (most reliable — it's a raw JWT)
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (bearerToken) {
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(bearerToken)
      if (!error && user) return user
    } catch {
      // fall through to cookie-based approach
    }
  }

  // 2. Try cookie-based approach — Supabase SSR stores the session in cookies
  const allCookies = req.cookies.getAll()
  const tokenCookies = allCookies
    .filter(c => c.name.includes('auth-token'))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (tokenCookies.length === 0) return null

  const rawCookieValue = tokenCookies.map(c => c.value).join('')

  if (!rawCookieValue) return null

  // The cookie may be prefixed with "base64-" — strip it and decode
  const base64Value = rawCookieValue.startsWith('base64-')
    ? rawCookieValue.slice(7)
    : rawCookieValue

  try {
    const decoded = Buffer.from(base64Value, 'base64').toString('utf-8')
    const session = JSON.parse(decoded)
    const jwt = session?.access_token

    if (!jwt) return null

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(jwt)
    if (error || !user) return null
    return user
  } catch {
    // Maybe the cookie itself is a raw JWT (older Supabase versions)
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(rawCookieValue)
      if (error || !user) return null
      return user
    } catch {
      return null
    }
  }
}
