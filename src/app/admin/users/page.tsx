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
    active: 'text-green-600', inactive: 'text-gray-400',
    cancelled: 'text-red-500', lapsed: 'text-yellow-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <input
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
            <tr>
              {['Name', 'Plan', 'Status', 'Scores', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => {
              const sub = user.subscriptions?.[0]
              return (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.full_name ?? '—'}</td>
                  <td className="px-4 py-3 capitalize">{sub?.plan ?? '—'}</td>
                  <td className={`px-4 py-3 capitalize font-medium ${statusColor[sub?.status] ?? 'text-gray-400'}`}>
                    {sub?.status ?? 'none'}
                  </td>
                  <td className="px-4 py-3">{user.scores?.length ?? 0}/5</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
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
          <p className="text-center text-gray-400 py-8">No users found.</p>
        )}
      </div>
    </div>
  )
}