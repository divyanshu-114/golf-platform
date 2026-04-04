'use client'
import { useEffect, useState } from 'react'

export default function AdminWinners() {
  const [winners, setWinners] = useState<{ id: string; profiles: { full_name: string }; draws: { month: string }; tier: number; prize_amount: number; verification_status: string; payout_status: string; proof_url: string }[]>([])

  const fetchWinners = () =>
    fetch('/api/admin/winners').then(r => r.json()).then(d => setWinners(d.winners ?? []))

  useEffect(() => { fetchWinners() }, [])

  const update = async (id: string, updates: object) => {
    await fetch(`/api/admin/winners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    fetchWinners()
  }

  const tierLabel = (t: number) => t === 5 ? '🏆 Jackpot' : t === 4 ? '🥈 4-Match' : '🥉 3-Match'

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="border-b border-charcoal/10 pb-4">
        <h1 className="font-heading text-3xl text-charcoal">Winners Management</h1>
      </div>

      <div className="bg-white border border-charcoal/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/5 text-charcoal/60 uppercase tracking-widest text-[10px] font-medium border-b border-charcoal/10">
            <tr>
              {['User', 'Draw', 'Tier', 'Prize', 'Verification', 'Payout', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {winners.map(w => (
              <tr key={w.id} className="border-b border-charcoal/5 hover:bg-cream/30 transition-colors last:border-0">
                <td className="px-6 py-4 font-medium text-charcoal">{w.profiles?.full_name ?? '—'}</td>
                <td className="px-6 py-4 text-charcoal/70 uppercase tracking-widest text-[10px] font-bold">
                  {new Date(w.draws?.month).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 font-heading text-lg text-olive">{tierLabel(w.tier)}</td>
                <td className="px-6 py-4 font-heading text-xl text-charcoal">£{w.prize_amount?.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select
                    value={w.verification_status}
                    onChange={e => update(w.id, { verification_status: e.target.value })}
                    className="border border-charcoal/20 bg-white rounded-none px-3 py-1 text-xs uppercase tracking-widest font-medium focus:outline-none focus:border-olive text-charcoal"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={w.payout_status}
                    onChange={e => update(w.id, { payout_status: e.target.value })}
                    className="border border-charcoal/20 bg-white rounded-none px-3 py-1 text-xs uppercase tracking-widest font-medium focus:outline-none focus:border-olive text-charcoal"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {w.proof_url ? (
                    <a href={w.proof_url} target="_blank" className="text-[10px] uppercase tracking-widest font-bold text-olive hover:underline transition-colors block mt-1">
                      View Proof
                    </a>
                  ) : (
                    <span className="text-charcoal/40 text-[10px] uppercase tracking-widest block mt-1">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {winners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal/60 text-sm uppercase tracking-widest font-medium">No winners yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}