'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Props {
  charityName: string | null
  charityId: string | null
  contributionPct: number
  userId: string
}

export default function CharityCard({ charityName, charityId, contributionPct, userId }: Props) {
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
        charity_id: charityId,
        contribution_pct: pct,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-cream rounded-none border border-charcoal/10">
      <div className="p-6">
        <label className="text-xs text-charcoal/60 uppercase tracking-widest font-medium mb-1 block">
          You are supporting
        </label>
        <p className="font-heading text-2xl text-charcoal mb-6 border-b border-charcoal/5 pb-4">
          {charityName || 'No charity selected'}
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <label className="text-xs text-charcoal/60 uppercase tracking-widest font-medium">
              Contribution %
            </label>
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
          
          <div className="flex justify-between text-xs text-charcoal/40 font-medium tracking-wider">
            <span>10% (Min)</span>
            <span>30% (Max)</span>
          </div>
        </div>

        {saved && (
          <p className="text-sm text-olive bg-olive/10 border border-olive/20 p-3 mb-4">Saved!</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleUpdate}
            disabled={saving || pct === contributionPct}
            className="w-full bg-charcoal text-cream py-3 text-sm tracking-widest uppercase hover:bg-black disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Update %'}
          </button>
          <Link 
            href="/dashboard/charity"
            className="w-full border border-charcoal/20 text-charcoal text-center py-3 text-sm tracking-widest uppercase hover:bg-charcoal/5 transition-colors block"
          >
            Change All
          </Link>
        </div>
      </div>
    </div>
  )
}