'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const GolfBallScene = dynamic(() => import('@/components/three/GolfBallScene'), { ssr: false })

function friendlyError(msg: string): string {
  if (msg.toLowerCase().includes('invalid')) return 'Invalid email or password.'
  return 'Something went wrong. Please try again.'
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      return setError(friendlyError(error.message))
    }

    if (authData?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()
        
      if (profile?.role === 'admin') {
        window.location.href = '/admin'
        return
      }
    }

    // Hard redirect to force a completely fresh server-side render with the brand new cookie
    window.location.href = '/dashboard'
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <GolfBallScene variant="dark" />
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <p className="text-3xl">⛳</p>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/60">Sign in to your GolfGives account</p>
          </div>
          <div className="space-y-3">
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
              placeholder="Password"
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
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-green-500/25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
          <p className="text-sm text-center text-white/50">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-green-400 font-medium hover:text-green-300 transition">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}