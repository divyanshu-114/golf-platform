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

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null)
    })

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
    window.location.href = '/'
  }

  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isDashboard
          ? 'bg-charcoal/95 backdrop-blur-md shadow-lg'
          : 'bg-charcoal'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Left nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wider">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors duration-300 uppercase text-xs font-medium"
          >
            Home
          </Link>
          <Link
            href={user ? '/charities' : '/login?next=/charities'}
            className="text-white/80 hover:text-white transition-colors duration-300 uppercase text-xs font-medium"
          >
            Charities
          </Link>
          <Link
            href={user ? '/#how-it-works' : '/login?next=/#how-it-works'}
            className="text-white/80 hover:text-white transition-colors duration-300 uppercase text-xs font-medium whitespace-nowrap"
          >
            How It Works
          </Link>
          <Link
            href={user ? '/#prizes' : '/login?next=/#prizes'}
            className="text-white/80 hover:text-white transition-colors duration-300 uppercase text-xs font-medium"
          >
            Prizes
          </Link>
        </div>

        {/* Center logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="font-heading text-white text-2xl md:text-3xl tracking-[0.3em] uppercase">
            GolfGives
          </span>
          <span className="flex gap-1 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gold text-[8px]">★</span>
            ))}
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden lg:block text-xs text-white/60 mr-1">
                {user.email}
              </span>
              {!isDashboard && (
                <Link
                  href="/dashboard"
                  className="hidden md:inline-block text-white/80 hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-xs text-white/60 hover:text-white transition-colors disabled:opacity-50 uppercase tracking-wider"
              >
                {loggingOut ? '...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-block text-white/80 hover:text-white text-xs uppercase tracking-wider transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/pricing"
                className="border border-olive text-olive hover:bg-olive hover:text-white text-xs px-6 py-2.5 uppercase tracking-widest transition-all duration-300"
              >
                Reservation
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="1.5">
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
        <div className="md:hidden bg-charcoal border-t border-white/10 px-6 py-6 space-y-4">
          <Link href="/" className="block text-sm text-white/80 uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href={user ? '/charities' : '/login?next=/charities'} className="block text-sm text-white/80 uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Charities</Link>
          <Link href={user ? '/#how-it-works' : '/login?next=/#how-it-works'} className="block text-sm text-white/80 uppercase tracking-wider" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href={user ? '/#prizes' : '/login?next=/#prizes'} className="block text-sm text-white/80 uppercase tracking-wider" onClick={() => setMenuOpen(false)}>Prizes</Link>
        </div>
      )}
    </nav>
  )
}