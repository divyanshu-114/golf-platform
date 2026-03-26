'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  charityName: string | null
  contributionPct: number
  userId: string
}

export default function CharityCard({ charityName, contributionPct, userId }: Props) {
  const [pct, setPct] = useState(contributionPct)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleUpdate = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    await fetch('/api/charities/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        charity_id: null, // Keep existing charity, just update pct
        contribution_pct: pct,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">Your Charity</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">💚</div>
        <div>
          <p className="font-semibold">{charityName ?? 'No charity selected'}</p>
          <a href="/dashboard/charity" className="text-xs text-blue-500 hover:underline">Change charity</a>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Contribution</span>
          <span className="font-semibold">{pct}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={pct}
          onChange={e => setPct(Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Min 10%</span>
          <span>Max 50%</span>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={saving || !userId}
        className="w-full bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Update Contribution'}
      </button>
    </div>
  )
}