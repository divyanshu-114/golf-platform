'use client'
import { useEffect, useState } from 'react'

export default function AdminOverview() {
  const [stats, setStats] = useState<{ totalUsers: number; activeSubscribers: number; totalDraws: number; totalPrizesPaid: number; estimatedCharityPool: number; avgCharityPct: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setStats)
  }, [])

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: '✅' },
    { label: 'Draws Published', value: stats.totalDraws, icon: '🎲' },
    { label: 'Total Prizes Paid', value: `£${stats.totalPrizesPaid.toFixed(2)}`, icon: '💰' },
    { label: 'Charity Pool (est.)', value: `£${stats.estimatedCharityPool}`, icon: '💚' },
    { label: 'Avg Charity %', value: `${stats.avgCharityPct}%`, icon: '📊' },
  ] : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>
      {!stats ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl border p-6 space-y-2">
              <span className="text-2xl">{icon}</span>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}