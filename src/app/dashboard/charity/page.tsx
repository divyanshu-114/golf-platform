'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Charity {
  id: string
  name: string
  description: string
  is_featured: boolean
}

export default function CharitySelectPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [pct, setPct] = useState(10)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/charities')
      .then(res => res.json())
      .then(data => {
        setCharities(data.charities ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSelect = async (charityId: string) => {
    setSaving(charityId)
    setSuccess('')
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    const res = await fetch('/api/charities/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ charity_id: charityId, contribution_pct: pct }),
    })
    setSaving(null)
    if (res.ok) {
      setSuccess(`Charity selected! ${pct}% of your subscription will be donated.`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F8F3]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-32 space-y-10">
        <BackButton label="Back to Dashboard" />

        <div className="space-y-4 border-b border-charcoal/10 pb-6">
          <h1 className="font-heading text-4xl text-charcoal">Designated Charity</h1>
          <p className="text-charcoal/70 text-lg leading-relaxed">
            A percentage of your subscription goes to a charity of your choice. Select one below to direct your contribution.
          </p>
        </div>

        {/* Contribution slider */}
        <div className="bg-white border border-charcoal/10 p-8 shadow-sm space-y-6">
          <h2 className="font-heading text-2xl text-charcoal border-b border-charcoal/5 pb-4">Contribution Level</h2>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/60 uppercase tracking-widest font-medium">Dedicate</span>
            <span className="text-olive font-heading text-xl">{pct}%</span>
          </div>
          
          <input
            type="range"
            min="10"
            max="30"
            step="5"
            value={pct}
            onChange={e => setPct(parseInt(e.target.value))}
            className="w-full accent-olive h-1 bg-charcoal/10 rounded-none appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-charcoal/40 uppercase tracking-widest font-medium">
            <span>Minimum (10%)</span>
            <span>Maximum (30%)</span>
          </div>
        </div>

        {/* Charity List */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl text-charcoal mb-6 border-b border-charcoal/5 pb-4">Available Partners</h2>
          {loading ? (
            <p className="text-charcoal/60 text-sm">Loading charities...</p>
          ) : charities.length === 0 ? (
            <p className="text-charcoal/60 text-sm">No charities found.</p>
          ) : (
            <div className="grid gap-4">
              {charities.map(charity => (
                <div 
                  key={charity.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-charcoal/10 bg-white transition-all duration-300 hover:border-olive/50"
                >
                  <div className="flex-1 pr-4 mb-4 md:mb-0">
                    <h3 className="font-heading text-xl text-charcoal mb-2">{charity.name}</h3>
                    <p className="text-sm text-charcoal/70 line-clamp-2 leading-relaxed">{charity.description}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleSelect(charity.id)}
                      disabled={saving !== null}
                      className="w-full md:w-auto border border-charcoal/20 text-charcoal px-8 py-3 text-sm tracking-widest uppercase hover:bg-olive hover:text-cream hover:border-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving === charity.id ? 'Saving...' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {success && (
          <div className="fixed bottom-6 right-6 bg-olive text-cream px-6 py-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
            <span className="text-xl">✓</span>
            <p className="font-medium text-sm tracking-widest uppercase">{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}
