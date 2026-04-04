'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BackButton from '@/components/BackButton'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let active = true

    const redirectAuthenticatedUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!active || !data.session?.user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single()

      router.replace(profile?.role === 'admin' ? '/admin' : '/dashboard')
    }

    void redirectAuthenticatedUser()

    return () => {
      active = false
    }
  }, [router, supabase])

  const handleSignup = async () => {
    setError('')
    setLoading(true)

    // Step 1: Create user via the standard signup endpoint
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    })
    const result = await res.json()

    if (!res.ok) {
      setLoading(false)
      return setError(result.error)
    }

    setLoading(false)
    router.replace('/login?signup=success')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/scenic-course.png"
          alt="Golf resort luxury course"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="mb-6">
          <BackButton label="Back to Login" variant="dark" />
        </div>
        <div className="bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl">
          <div className="text-center space-y-3">
            <h1 className="font-heading text-3xl text-white tracking-wide">Create Account</h1>
            <p className="text-cream/70 font-light">Join the Almaris community</p>
          </div>
          
          <div className="space-y-4">
            <input
              className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-olive focus:bg-white/10 transition-colors"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-olive focus:bg-white/10 transition-colors"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-olive focus:bg-white/10 transition-colors"
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading || !email || !password || !fullName}
            className="w-full bg-olive text-cream py-3.5 text-sm uppercase tracking-widest hover:bg-[#7a8c54] disabled:opacity-50 transition-colors border border-olive"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-sm text-center text-cream/70 font-light pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-olive hover:text-white transition-colors border-b border-olive/30 pb-0.5">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}