'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
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
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 space-y-8">
        <div>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-black transition">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold mt-2">Choose Your Charity</h1>
          <p className="text-gray-400 mt-1">Select a charity to support with a portion of your subscription.</p>
        </div>

        {/* Contribution slider */}
        <div className="bg-white rounded-2xl border p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Your contribution percentage</span>
            <span className="font-bold text-lg">{pct}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={pct}
            onChange={e => setPct(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Min 10%</span>
            <span>Max 50%</span>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            ✓ {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charities.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border p-6 space-y-3 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">💚</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                  </div>
                </div>
                {c.is_featured && (
                  <span className="inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⭐ Featured</span>
                )}
                <button
                  onClick={() => handleSelect(c.id)}
                  disabled={saving === c.id}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
                >
                  {saving === c.id ? 'Selecting...' : `Select & Donate ${pct}%`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
