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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Winners Management</h1>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {['User', 'Draw', 'Tier', 'Prize', 'Verification', 'Payout', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {winners.map(w => (
              <tr key={w.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{w.profiles?.full_name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(w.draws?.month).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">{tierLabel(w.tier)}</td>
                <td className="px-4 py-3 font-semibold">£{w.prize_amount?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <select
                    value={w.verification_status}
                    onChange={e => update(w.id, { verification_status: e.target.value })}
                    className="border rounded-lg px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={w.payout_status}
                    onChange={e => update(w.id, { payout_status: e.target.value })}
                    className="border rounded-lg px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {w.proof_url && (
                    <a href={w.proof_url} target="_blank" className="text-xs text-blue-500 hover:underline">
                      View Proof
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {winners.length === 0 && (
          <p className="text-center text-gray-500 py-8">No winners yet.</p>
        )}
      </div>
    </div>
  )
}