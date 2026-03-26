'use client'
import { useEffect, useState } from 'react'

const empty = { name: '', description: '', image_url: '', is_featured: false }

export default function AdminCharities() {
  const [charities, setCharities] = useState<{ id: string; name: string; description: string; image_url: string; is_featured: boolean }[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchCharities = () =>
    fetch('/api/admin/charities').then(r => r.json()).then(d => setCharities(d.charities ?? []))

  useEffect(() => { fetchCharities() }, [])

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      await fetch(`/api/admin/charities/${editing}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch('/api/admin/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setForm(empty)
    setEditing(null)
    setSaving(false)
    fetchCharities()
  }

  const handleEdit = (c: { id: string; name: string; description: string; image_url: string; is_featured: boolean }) => {
    setEditing(c.id)
    setForm({ name: c.name, description: c.description, image_url: c.image_url ?? '', is_featured: c.is_featured })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this charity?')) return
    await fetch(`/api/admin/charities/${id}`, { method: 'DELETE' })
    fetchCharities()
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Charity Management</h1>

      {/* Form */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">{editing ? 'Edit Charity' : 'Add New Charity'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Charity name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.is_featured}
            onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
            className="accent-black"
          />
          <label htmlFor="featured" className="text-sm">Set as featured/spotlight charity</label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !form.name}
            className="bg-black text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : editing ? 'Update Charity' : 'Add Charity'}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setForm(empty) }}
              className="border px-6 py-2 rounded-xl text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              {['Name', 'Featured', 'Description', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {charities.map(c => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">
                  {c.is_featured
                    ? <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⭐ Featured</span>
                    : <span className="text-xs text-gray-500">—</span>
                  }
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{c.description}</td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => handleEdit(c)} className="text-xs text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {charities.length === 0 && (
          <p className="text-center text-gray-500 py-8">No charities yet.</p>
        )}
      </div>
    </div>
  )
}