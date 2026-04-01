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

  // 2. Try cookie-based approach using createClient which parses cookies automatically
  const { createClient: createServerClient } = await import('@/lib/supabase/server')
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}
