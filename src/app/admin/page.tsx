'use client'
import { useEffect, useState } from 'react'

export default function AdminOverview() {
  const [stats, setStats] = useState<{ totalUsers: number; activeSubscribers: number; totalDraws: number; totalPrizesPaid: number; estimatedCharityPool: number; avgCharityPct: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setStats)
  }, [])

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥' },
    { label: 'Active Subscribers', value: stats.activeSubscribers || 0, icon: '✅' },
    { label: 'Draws Published', value: stats.totalDraws || 0, icon: '🎲' },
    { label: 'Total Prizes Paid', value: `£${(stats.totalPrizesPaid || 0).toFixed(2)}`, icon: '💰' },
    { label: 'Charity Pool (est.)', value: `£${(stats.estimatedCharityPool || 0).toFixed(2)}`, icon: '💚' },
    { label: 'Avg Charity %', value: `${(stats.avgCharityPct || 0).toFixed(1)}%`, icon: '📊' },
  ] : []

  return (
    <div className="space-y-8 max-w-6xl">
      <h1 className="font-heading text-3xl text-charcoal border-b border-charcoal/10 pb-4">Overview</h1>
      {!stats ? (
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-olive/20 border-t-olive rounded-full animate-spin" />
          <p className="text-charcoal/60 uppercase tracking-widest text-sm font-medium">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ label, value, icon }) => (
            <div key={label} className="bg-white border border-charcoal/10 p-8 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl mb-4 block">{icon}</span>
              <p className="font-heading text-4xl text-charcoal mb-2">{value}</p>
              <p className="text-xs text-charcoal/60 uppercase tracking-widest font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}