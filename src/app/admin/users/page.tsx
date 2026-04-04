'use client'
import { useEffect, useState } from 'react'

export default function AdminUsers() {
  const [users, setUsers] = useState<{ id: string; full_name: string; subscriptions: { plan: string; status: string }[]; scores: unknown[]; created_at: string }[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users ?? []))
  }, [])

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const statusColor: Record<string, string> = {
    active: 'bg-olive/10 text-olive border-olive/20',
    inactive: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
    cancelled: 'bg-red-100/50 text-red-700 border-red-200/50',
    lapsed: 'bg-yellow-100/50 text-yellow-800 border-yellow-200/50'
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-end border-b border-charcoal/10 pb-4">
        <h1 className="font-heading text-3xl text-charcoal">Users</h1>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-charcoal/20 bg-white px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-olive rounded-none w-64 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
        />
      </div>

      <div className="bg-white border border-charcoal/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/5 text-charcoal/60 uppercase tracking-widest text-[10px] font-medium border-b border-charcoal/10">
            <tr>
              {['Name', 'Plan', 'Status', 'Scores', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => {
              const sub = user.subscriptions?.[0]
              return (
                <tr key={user.id} className="border-b border-charcoal/5 hover:bg-cream/30 transition-colors last:border-0">
                  <td className="px-6 py-4 font-medium text-charcoal">{user.full_name ?? '—'}</td>
                  <td className="px-6 py-4 text-charcoal/70 capitalize uppercase tracking-widest text-xs font-bold">{sub?.plan ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest px-3 py-1 font-bold border ${statusColor[sub?.status] ?? 'bg-charcoal/5 text-charcoal/60 border-charcoal/10'}`}>
                      {sub?.status ?? 'none'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-charcoal">
                    <span className="font-heading text-lg">{user.scores?.length ?? 0}</span><span className="text-charcoal/40 text-xs">/5</span>
                  </td>
                  <td className="px-6 py-4 text-charcoal/60">
                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal/60 text-sm uppercase tracking-widest font-medium">No users found.</p>
          </div>
        )}
      </div>
    </div>
  )
}