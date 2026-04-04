'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'

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
    <div className="min-h-screen bg-[#F9F8F3]">
      <Navbar />

      <div className="bg-charcoal pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-8">
            <BackButton label="Back to Home" variant="dark" />
          </div>
          <div className="text-center">
            <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium mb-3">Membership</p>
            <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Join the Platform</h1>
            <p className="text-cream/70 font-light max-w-2xl mx-auto text-lg">
              Play. Win. Give Back. Choose the plan that fits your ambition.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 pb-24 relative z-20">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Monthly */}
          <div className="bg-white border border-charcoal/10 p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="flex-1">
              <h2 className="font-heading text-2xl text-charcoal mb-2">Monthly</h2>
              <p className="text-charcoal/60 text-sm mb-6">Flexible membership, cancel anytime.</p>
              <div className="mb-8 border-b border-charcoal/5 pb-8">
                <p className="font-heading text-5xl text-olive flex items-baseline">
                  £9.99 <span className="text-base text-charcoal/40 font-sans ml-2 tracking-widest uppercase">/ mo</span>
                </p>
              </div>
              <ul className="text-sm text-charcoal/70 space-y-4 mb-8">
                <li className="flex items-center gap-3"><span className="text-olive text-lg">✓</span> Enter monthly draws</li>
                <li className="flex items-center gap-3"><span className="text-olive text-lg">✓</span> Track your golf scores</li>
                <li className="flex items-center gap-3"><span className="text-olive text-lg">✓</span> Support your chosen charity</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={!!loading}
              className="w-full bg-charcoal text-cream py-4 uppercase tracking-widest text-xs font-medium hover:bg-black disabled:opacity-50 transition-colors border border-charcoal disabled:cursor-not-allowed"
            >
              {loading === 'monthly' ? 'Redirecting...' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-charcoal text-cream p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col scale-100 md:scale-105 z-10 border border-charcoal shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-olive/10 rounded-full blur-2xl" />
            <span className="absolute -top-3 right-8 bg-olive text-cream text-[10px] uppercase tracking-widest px-4 py-1 font-medium shadow-md">
              Best Value
            </span>
            
            <div className="relative z-10 flex-1">
              <h2 className="font-heading text-2xl text-white mb-2">Yearly</h2>
              <p className="text-cream/60 text-sm mb-6">Commit for the year and save.</p>
              <div className="mb-8 border-b border-white/10 pb-8">
                <p className="font-heading text-5xl text-white flex items-baseline">
                  £99.99 <span className="text-base text-cream/40 font-sans ml-2 tracking-widest uppercase">/ yr</span>
                </p>
              </div>
              <ul className="text-sm text-cream/80 space-y-4 mb-8">
                <li className="flex items-center gap-3"><span className="text-olive text-lg">✓</span> Everything in Monthly</li>
                <li className="flex items-center gap-3"><span className="text-olive text-lg">✓</span> <strong>2 months free</strong></li>
                <li className="flex items-center gap-3"><span className="text-olive text-lg">✓</span> Priority winner verification</li>
              </ul>
            </div>
            
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={!!loading}
              className="w-full relative z-10 bg-olive text-cream py-4 uppercase tracking-widest text-xs font-medium hover:bg-[#7a8c54] disabled:opacity-50 transition-colors border border-olive disabled:cursor-not-allowed"
            >
              {loading === 'yearly' ? 'Redirecting...' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}