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
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-end border-b border-charcoal/10 pb-4">
        <h1 className="font-heading text-3xl text-charcoal">Draw Management</h1>
        <div className="flex gap-4 items-center">
          <select
            value={mode}
            onChange={e => setMode(e.target.value as 'random' | 'algorithmic')}
            className="border border-charcoal/20 bg-white px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-olive rounded-none uppercase tracking-widest font-medium"
          >
            <option value="random">Random Mode</option>
            <option value="algorithmic">Algorithmic Mode</option>
          </select>
          <button
            onClick={createDraw}
            disabled={loading}
            className="bg-charcoal text-cream px-6 py-2 text-xs uppercase tracking-widest font-medium hover:bg-black disabled:opacity-50 transition-colors border border-charcoal"
          >
            New Draw
          </button>
        </div>
      </div>

      {/* Simulation Result */}
      {simulation && (
        <div className="bg-cream/50 border border-olive/30 p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-charcoal/5 pb-4">
            <p className="font-heading text-xl text-charcoal">Simulation Preview</p>
            <span className="text-[10px] bg-charcoal/5 text-charcoal/60 px-3 py-1 uppercase tracking-widest font-bold border border-charcoal/10">Not Published</span>
          </div>
          <div>
            <p className="text-xs text-charcoal/60 uppercase tracking-widest font-medium mb-3">Winning Numbers</p>
            <div className="flex gap-3">
              {simulation.winningNumbers.map((n: number) => (
                <div key={n} className="w-12 h-12 bg-olive text-cream flex items-center justify-center font-heading text-xl border border-olive">
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="bg-white border border-charcoal/10 p-5 shadow-sm">
              <p className="text-xs text-charcoal/60 uppercase tracking-widest font-medium mb-1">5-Match Winners</p>
              <p className="font-heading text-2xl text-charcoal">{simulation.winners[5]?.length ?? 0}</p>
              <p className="text-xs text-charcoal/50 mt-2 font-medium">Pool: £{simulation.pools.tier5}</p>
            </div>
            <div className="bg-white border border-charcoal/10 p-5 shadow-sm">
              <p className="text-xs text-charcoal/60 uppercase tracking-widest font-medium mb-1">4-Match Winners</p>
              <p className="font-heading text-2xl text-charcoal">{simulation.winners[4]?.length ?? 0}</p>
              <p className="text-xs text-charcoal/50 mt-2 font-medium">Pool: £{simulation.pools.tier4}</p>
            </div>
            <div className="bg-white border border-charcoal/10 p-5 shadow-sm">
              <p className="text-xs text-charcoal/60 uppercase tracking-widest font-medium mb-1">3-Match Winners</p>
              <p className="font-heading text-2xl text-charcoal">{simulation.winners[3]?.length ?? 0}</p>
              <p className="text-xs text-charcoal/50 mt-2 font-medium">Pool: £{simulation.pools.tier3}</p>
            </div>
          </div>
          {simulation.winners[5]?.length === 0 && (
            <p className="text-xs text-olive font-medium tracking-widest uppercase bg-olive/10 border border-olive/20 p-4">
              Alert: No jackpot winner — £{simulation.pools.tier5} will roll over
            </p>
          )}
          <button
            onClick={() => publish(simulation.draw_id)}
            disabled={loading}
            className="bg-olive text-cream px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#7a8c54] disabled:opacity-50 transition-colors border border-olive"
          >
            Publish Official Draw
          </button>
        </div>
      )}

      {/* Draws Table */}
      <div className="bg-white border border-charcoal/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/5 text-charcoal/60 uppercase tracking-widest text-[10px] font-medium border-b border-charcoal/10">
            <tr>
              {['Month', 'Status', 'Winning Numbers', 'Jackpot Rollover', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draws.map(draw => (
              <tr key={draw.id} className="border-b border-charcoal/5 hover:bg-cream/30 transition-colors last:border-0">
                <td className="px-6 py-4 font-medium text-charcoal">
                  {new Date(draw.month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 font-bold border ${
                    draw.status === 'published' ? 'bg-olive/10 text-olive border-olive/20' :
                    draw.status === 'simulated' ? 'bg-yellow-100/50 text-yellow-800 border-yellow-200/50' :
                    'bg-charcoal/5 text-charcoal/60 border-charcoal/10'
                  }`}>{draw.status}</span>
                </td>
                <td className="px-6 py-4">
                  {draw.winning_numbers
                    ? <div className="flex gap-2">{draw.winning_numbers.map((n: number) => (
                        <span key={n} className="w-8 h-8 bg-charcoal text-cream text-[10px] flex items-center justify-center font-bold">{n}</span>
                      ))}</div>
                    : <span className="text-charcoal/40">—</span>
                  }
                </td>
                <td className="px-6 py-4">
                  {draw.jackpot_rollover > 0
                    ? <span className="text-olive font-heading text-lg">£{draw.jackpot_rollover.toFixed(2)}</span>
                    : <span className="text-charcoal/40">—</span>
                  }
                </td>
                <td className="px-6 py-4">
                  {draw.status === 'pending' && (
                    <button
                      onClick={() => simulate(draw.id)}
                      className="text-[10px] uppercase tracking-widest font-bold bg-white border border-charcoal/20 px-4 py-2 hover:bg-charcoal/5 transition-colors text-charcoal"
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
          <div className="text-center py-12">
            <p className="text-charcoal/60 text-sm uppercase tracking-widest font-medium">No draws yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}