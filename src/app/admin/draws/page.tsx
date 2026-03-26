'use client'
import { useEffect, useState } from 'react'

export default function AdminDraws() {
  const [draws, setDraws] = useState<{ id: string; month: string; status: string; winning_numbers: number[]; jackpot_rollover: number }[]>([])
  const [mode, setMode] = useState<'random' | 'algorithmic'>('random')
  const [simulation, setSimulation] = useState<{ draw_id: string; winningNumbers: number[]; winners: Record<number, unknown[]>; pools: { tier5: number; tier4: number; tier3: number } } | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDraws = () =>
    fetch('/api/admin/draws').then(r => r.json()).then(d => setDraws(d.draws ?? []))

  useEffect(() => { fetchDraws() }, [])

  const createDraw = async () => {
    setLoading(true)
    await fetch('/api/admin/draw/create', { method: 'POST' })
    await fetchDraws()
    setLoading(false)
  }

  const simulate = async (draw_id: string) => {
    setLoading(true)
    const res = await fetch('/api/admin/draw/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draw_id, mode })
    })
    const data = await res.json()
    setSimulation({ ...data, draw_id })
    setLoading(false)
  }

  const publish = async (draw_id: string) => {
    if (!confirm('Publish this draw? This cannot be undone.')) return
    setLoading(true)
    await fetch('/api/admin/draw/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draw_id, mode })
    })
    setSimulation(null)
    await fetchDraws()
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Draw Management</h1>
        <div className="flex gap-3 items-center">
          <select
            value={mode}
            onChange={e => setMode(e.target.value as 'random' | 'algorithmic')}
            className="border rounded-xl px-3 py-2 text-sm focus:outline-none"
          >
            <option value="random">🎲 Random</option>
            <option value="algorithmic">🧠 Algorithmic</option>
          </select>
          <button
            onClick={createDraw}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            + New Draw
          </button>
        </div>
      </div>

      {/* Simulation Result */}
      {simulation && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-amber-800">🔍 Simulation Preview</p>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">Not Published</span>
          </div>
          <div>
            <p className="text-xs text-amber-600 mb-2">Winning Numbers</p>
            <div className="flex gap-2">
              {simulation.winningNumbers.map((n: number) => (
                <div key={n} className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-600">5-Match Winners</p>
              <p className="font-bold text-lg">{simulation.winners[5]?.length ?? 0}</p>
              <p className="text-xs text-gray-500">Pool: £{simulation.pools.tier5}</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-600">4-Match Winners</p>
              <p className="font-bold text-lg">{simulation.winners[4]?.length ?? 0}</p>
              <p className="text-xs text-gray-500">Pool: £{simulation.pools.tier4}</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-xs text-gray-600">3-Match Winners</p>
              <p className="font-bold text-lg">{simulation.winners[3]?.length ?? 0}</p>
              <p className="text-xs text-gray-500">Pool: £{simulation.pools.tier3}</p>
            </div>
          </div>
          {simulation.winners[5]?.length === 0 && (
            <p className="text-xs text-amber-700 font-medium">
              ⚠️ No jackpot winner — £{simulation.pools.tier5} will roll over
            </p>
          )}
          <button
            onClick={() => publish(simulation.draw_id)}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            Publish Official Draw
          </button>
        </div>
      )}

      {/* Draws Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {['Month', 'Status', 'Winning Numbers', 'Jackpot Rollover', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draws.map(draw => (
              <tr key={draw.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {new Date(draw.month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    draw.status === 'published' ? 'bg-green-100 text-green-700' :
                    draw.status === 'simulated' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{draw.status}</span>
                </td>
                <td className="px-4 py-3">
                  {draw.winning_numbers
                    ? <div className="flex gap-1">{draw.winning_numbers.map((n: number) => (
                        <span key={n} className="w-7 h-7 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">{n}</span>
                      ))}</div>
                    : <span className="text-gray-500">—</span>
                  }
                </td>
                <td className="px-4 py-3">
                  {draw.jackpot_rollover > 0
                    ? <span className="text-amber-600 font-medium">£{draw.jackpot_rollover}</span>
                    : '—'
                  }
                </td>
                <td className="px-4 py-3">
                  {draw.status === 'pending' && (
                    <button
                      onClick={() => simulate(draw.id)}
                      className="text-xs bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200"
                    >
                      Simulate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {draws.length === 0 && (
          <p className="text-center text-gray-500 py-8">No draws yet.</p>
        )}
      </div>
    </div>
  )
}