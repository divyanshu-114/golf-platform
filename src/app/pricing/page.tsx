'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoading(plan)
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    if (!token) {
      setLoading(null)
      return alert('Please log in first to subscribe.')
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan })
    })
    const { url, error } = await res.json()
    if (error) { setLoading(null); return alert(error) }
    router.push(url)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 px-6">
        <h1 className="text-4xl font-bold text-center mb-4">Join the Platform</h1>
        <p className="text-center text-gray-500 mb-12">Play. Win. Give Back.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly */}
          <div className="border rounded-2xl p-8 space-y-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Monthly</h2>
            <p className="text-4xl font-bold">£9.99 <span className="text-base font-normal text-gray-400">/mo</span></p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Enter monthly draws</li>
              <li>✓ Track your golf scores</li>
              <li>✓ Support your chosen charity</li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={!!loading}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading === 'monthly' ? 'Redirecting...' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly */}
          <div className="border-2 border-black rounded-2xl p-8 space-y-4 relative hover:shadow-lg transition">
            <span className="absolute top-4 right-4 bg-black text-white text-xs px-2 py-1 rounded-full">Best Value</span>
            <h2 className="text-xl font-semibold">Yearly</h2>
            <p className="text-4xl font-bold">£99.99 <span className="text-base font-normal text-gray-400">/yr</span></p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Everything in Monthly</li>
              <li>✓ 2 months free</li>
              <li>✓ Priority winner verification</li>
            </ul>
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={!!loading}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading === 'yearly' ? 'Redirecting...' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}