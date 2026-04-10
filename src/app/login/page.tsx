'use client'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import BackButton from '@/components/BackButton'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() ?? ''

function friendlyError(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('invalid')) return 'Invalid email or password.'
  if (lower.includes('email not confirmed')) return 'Please confirm your email before logging in. Check your inbox for a confirmation link.'
  return 'Something went wrong. Please try again.'
}

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')
  const signupSuccess = searchParams.get('signup') === 'success'
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

      if (profile?.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace(nextParam || '/dashboard')
      }
    }

    void redirectAuthenticatedUser()

    return () => {
      active = false
    }
  }, [router, supabase, nextParam])

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      return setError(friendlyError(error.message))
    }

    if (authData?.user) {
      if (ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL) {
        router.replace('/admin')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profile?.role === 'admin') {
        router.replace('/admin')
        return
      }
    }

    router.replace(nextParam || '/dashboard')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-golfer.png"
          alt="Golf resort sunset"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="mb-6">
          <BackButton label="Back to Home" variant="dark" />
        </div>
        <div className="bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl">
          <div className="text-center space-y-3">
            <h1 className="font-heading text-3xl text-white tracking-wide">Welcome Back</h1>
            <p className="text-cream/70 font-light">Sign in to your GolfGives account</p>
          </div>
          
          <div className="space-y-4">
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
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {signupSuccess && (
            <p className="text-green-300 text-sm bg-green-900/20 border border-green-500/20 p-3">
              Account created! You can now sign in.
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/20 p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-olive text-cream py-3.5 text-sm uppercase tracking-widest hover:bg-[#7a8c54] disabled:opacity-50 transition-colors border border-olive"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <p className="text-sm text-center text-cream/70 font-light pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-olive hover:text-white transition-colors border-b border-olive/30 pb-0.5">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-charcoal" />}>
      <LoginContent />
    </Suspense>
  )
}