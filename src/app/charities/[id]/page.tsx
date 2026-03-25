'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

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
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

      {donated && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 text-sm font-medium">
          ✅ Thank you! Your donation has been received.
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl p-8 space-y-3">
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-3xl">💚</div>
        <h1 className="text-3xl font-bold">{charity.name}</h1>
        <p className="text-gray-300">{charity.description}</p>
        {charity.is_featured && (
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">⭐ Featured Charity</span>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Select as my charity */}
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Support via Subscription</h2>
          <p className="text-sm text-gray-400">
            Set this as your chosen charity. A minimum of 10% of your subscription will go directly to them.
          </p>
          <button
            onClick={handleSelect}
            disabled={selecting || selected}
            className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {selected ? '✓ Selected as my charity' : selecting ? 'Saving...' : 'Choose this charity'}
          </button>
        </div>

        {/* One-off donation */}
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Make a Donation</h2>
          <p className="text-sm text-gray-400">
            Make a one-off donation directly to this charity, independent of your subscription.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
              <input
                type="number"
                min={1}
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                placeholder="10"
                className="w-full border rounded-xl pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <button
              onClick={handleDonate}
              disabled={donating}
              className="bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {donating ? '...' : 'Donate'}
            </button>
          </div>
          <div className="flex gap-2">
            {[5, 10, 25, 50].map(amt => (
              <button
                key={amt}
                onClick={() => setDonationAmount(String(amt))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition
                  ${donationAmount === String(amt) ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-gray-400'}`}
              >
                £{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {charity.charity_events?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <div className="space-y-3">
            {charity.charity_events
              .sort((a: { event_date: string }, b: { event_date: string }) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
              .map((event: { id: string; title: string; description: string; location: string; event_date: string }) => (
                <div key={event.id} className="bg-white border rounded-2xl p-5 flex gap-5 items-start">
                  <div className="bg-black text-white rounded-xl p-3 text-center min-w-14">
                    <p className="text-xs">{new Date(event.event_date).toLocaleDateString('en-GB', { month: 'short' })}</p>
                    <p className="text-xl font-bold">{new Date(event.event_date).getDate()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    {event.description && <p className="text-sm text-gray-400 mt-1">{event.description}</p>}
                    {event.location && <p className="text-xs text-gray-400 mt-1">📍 {event.location}</p>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}