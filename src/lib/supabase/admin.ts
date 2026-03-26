import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Admin client bypasses RLS — use ONLY in server-side API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Extract and verify the authenticated user from a Next.js API request.
 * Reads the Supabase auth token from cookies or the Authorization header.
 * Returns the user object or null if not authenticated.
 */
export async function getAuthUser(req: NextRequest) {
  // Try to get token from cookies (set by @supabase/ssr middleware)
  const accessToken =
    req.cookies.get('sb-agwlbfpqxcjqsktayfes-auth-token.0')?.value ??
    req.cookies.get('sb-agwlbfpqxcjqsktayfes-auth-token')?.value ??
    null

  // Also check Authorization header
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  const token = accessToken || bearerToken

  if (!token) {
    // Fallback: try the full cookie-based approach via admin
    // Parse all sb-* cookies to reconstruct the session
    const allCookies = req.cookies.getAll()
    const sbCookies = allCookies.filter(c => c.name.startsWith('sb-'))

    if (sbCookies.length === 0) return null

    // For chunked tokens, reconstruct them
    const tokenCookies = sbCookies
      .filter(c => c.name.includes('auth-token'))
      .sort((a, b) => a.name.localeCompare(b.name))

    if (tokenCookies.length === 0) return null

    const fullToken = tokenCookies.map(c => c.value).join('')

    if (!fullToken) return null

    try {
      // Parse the base64-encoded session JSON
      const decoded = Buffer.from(fullToken, 'base64').toString('utf-8')
      const session = JSON.parse(decoded)
      const jwt = session?.access_token

      if (!jwt) return null

      const { data: { user }, error } = await supabaseAdmin.auth.getUser(jwt)
      if (error || !user) return null
      return user
    } catch {
      return null
    }
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}
