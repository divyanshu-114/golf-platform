'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import BackButton from '@/components/BackButton'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CharityProfilePage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const donated = searchParams.get('donated')

  const [charity, setCharity] = useState<{ name: string; description: string; is_featured: boolean; charity_events: { id: string; title: string; description: string; location: string; event_date: string }[] } | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [selecting, setSelecting] = useState(false)
  const [donating, setDonating] = useState(false)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    fetch(`/api/charities/${id}`)
      .then(r => r.json())
      .then(d => setCharity(d.charity))
  }, [id])

  const handleSelect = async () => {
    setSelecting(true)
    await fetch('/api/charities/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charity_id: id, contribution_pct: 10 })
    })
    setSelecting(false)
    setSelected(true)
  }

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount)
    if (!amount || amount < 1) return alert('Minimum donation is £1')
    setDonating(true)
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charity_id: id, amount, charity_name: charity?.name })
    })
    const { url } = await res.json()
    window.location.href = url
  }

  if (!charity) return (
    <div className="flex justify-center items-center min-h-[50vh] bg-[#F9F8F3]">
      <div className="w-12 h-12 border-2 border-olive/20 border-t-olive rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-charcoal flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        <div className="mb-8">
          <BackButton />
        </div>

        {donated && (
          <div className="bg-olive/10 border border-olive/20 rounded-none p-4 text-olive text-sm font-medium mb-8">
            ✅ Thank you! Your donation has been received.
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-heading font-bold text-charcoal mb-4">{charity.name}</h1>
          {charity.is_featured && (
            <span className="text-xs font-medium bg-olive/10 text-olive px-3 py-1 uppercase tracking-widest border border-olive/20">
              Featured Partner
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white border border-charcoal/10 p-8 shadow-sm">
              <h2 className="font-heading text-2xl text-charcoal mb-4">About the Cause</h2>
              <div className="prose prose-olive max-w-none">
                <p className="text-charcoal/70 leading-relaxed whitespace-pre-wrap">
                  {charity.description}
                </p>
              </div>
            </div>

            {/* Events */}
            {charity.charity_events && charity.charity_events.length > 0 && (
              <div className="bg-white border border-charcoal/10 p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-charcoal border-b border-charcoal/5 pb-4 mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                  {charity.charity_events
                    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                    .map((event) => (
                    <div key={event.id} className="flex justify-between items-start p-4 border border-charcoal/10 bg-cream/30">
                      <div>
                        <h3 className="font-heading text-lg text-charcoal">{event.title}</h3>
                        {event.description && <p className="text-sm text-charcoal/70 mt-1">{event.description}</p>}
                        {event.location && <p className="text-xs text-charcoal/50 mt-2 uppercase tracking-widest">📍 {event.location}</p>}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-olive bg-olive/10 px-3 py-1 border border-olive/20">
                          {new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-charcoal text-cream p-8 shadow-lg">
              <h3 className="font-heading text-2xl text-white mb-2">Support Monthly</h3>
              <p className="text-sm text-cream/70 mb-6 leading-relaxed">
                Set this as your chosen charity. A minimum of 10% of your subscription will go directly to them.
              </p>
              <button
                onClick={handleSelect}
                disabled={selecting || selected}
                className="w-full bg-olive text-cream py-3 tracking-widest uppercase text-xs font-medium hover:bg-[#7a8c54] transition-colors disabled:opacity-50 border border-olive disabled:cursor-not-allowed"
              >
                {selected ? '✓ Selected' : selecting ? 'Saving...' : 'Choose Charity'}
              </button>
            </div>

            <div className="bg-white border border-charcoal/10 p-8 shadow-sm">
              <h3 className="font-heading text-2xl text-charcoal mb-2">One-off Donation</h3>
              <p className="text-sm text-charcoal/70 mb-6 leading-relaxed">
                Make a direct donation to {charity.name}, independent of your subscription.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 font-heading text-lg">£</span>
                    <input
                      type="number"
                      min={1}
                      value={donationAmount}
                      onChange={e => setDonationAmount(e.target.value)}
                      placeholder="10"
                      className="w-full bg-white border border-charcoal/10 rounded-none pl-8 pr-4 py-3 text-sm text-charcoal focus:outline-none focus:border-olive transition-colors h-full"
                    />
                  </div>
                  <button
                    onClick={handleDonate}
                    disabled={donating}
                    className="bg-charcoal text-cream px-6 py-3 uppercase tracking-widest text-xs font-medium hover:bg-black disabled:opacity-50 transition-colors border border-charcoal disabled:cursor-not-allowed"
                  >
                    {donating ? '...' : 'Donate'}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setDonationAmount(String(amt))}
                      className={`py-2 text-xs font-medium transition border ${
                        donationAmount === String(amt) 
                          ? 'bg-olive border-olive text-cream' 
                          : 'bg-cream/30 border-charcoal/10 text-charcoal/70 hover:border-charcoal/30'
                      }`}
                    >
                      £{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}