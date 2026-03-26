'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()

    // Use getSession (reads local JWT token — no server round-trip)
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
      }
    )

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/login'
  }

  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled || isDashboard ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">⛳ GolfGives</Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/charities" className="text-gray-600 hover:text-black transition">Charities</Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-black transition">How It Works</Link>
          <Link href="/#prizes" className="text-gray-600 hover:text-black transition">Prizes</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:block text-xs text-gray-500 mr-1">
                {user.email}
              </span>
              {!isDashboard && (
                <Link href="/dashboard"
                  className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition disabled:opacity-50 font-medium"
              >
                {loggingOut ? '...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-black transition">Log in</Link>
              <Link href="/pricing"
                className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          <Link href="/charities" className="block text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Charities</Link>
          <Link href="/#how-it-works" className="block text-sm text-gray-600" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/#prizes" className="block text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Prizes</Link>
        </div>
      )}
    </nav>
  )
}