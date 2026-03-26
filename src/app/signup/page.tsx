'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import BackButton from '@/components/BackButton'

const GolfBallScene = dynamic(() => import('@/components/three/GolfBallScene'), { ssr: false })

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError('')
    setLoading(true)

    // Step 1: Create user via admin API (bypasses email rate limits)
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

    // Step 2: Sign in immediately with the newly created credentials
    const supabase = createClient()
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setLoading(false)
      return setError('Account created, but auto-login failed. Please go to the login page.')
    }

    // Step 3: Hard redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <GolfBallScene variant="dark" />
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="mb-4">
          <BackButton label="← Back" variant="dark" />
        </div>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <p className="text-3xl">⛳</p>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-white/60">Join GolfGives and start making a difference</p>
          </div>
          <div className="space-y-3">
            <input
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent backdrop-blur-sm"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <input
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent backdrop-blur-sm"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent backdrop-blur-sm"
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          <button
            onClick={handleSignup}
            disabled={loading || !email || !password || !fullName}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-green-500/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Creating account...
              </span>
            ) : 'Sign Up'}
          </button>
          <p className="text-sm text-center text-white/50">
            Already have an account?{' '}
            <Link href="/login" className="text-green-400 font-medium hover:text-green-300 transition">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}