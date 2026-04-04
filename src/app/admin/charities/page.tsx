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
    <div className="space-y-12 max-w-6xl">
      <div className="border-b border-charcoal/10 pb-4">
        <h1 className="font-heading text-3xl text-charcoal">Charity Management</h1>
      </div>

      {/* Form */}
      <div className="bg-cream/50 border border-olive/30 p-8 space-y-6">
        <h2 className="font-heading text-xl text-charcoal border-b border-charcoal/5 pb-4">
          {editing ? 'Edit Partner Charity' : 'Add New Partner'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Charity name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-olive rounded-none"
          />
          <input
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            className="border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-olive rounded-none"
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full border border-charcoal/20 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-olive rounded-none resize-none"
        />
        <div className="flex items-center gap-3 bg-white p-4 border border-charcoal/10">
          <input
            type="checkbox"
            id="featured"
            checked={form.is_featured}
            onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
            className="accent-olive w-4 h-4 cursor-pointer"
          />
          <label htmlFor="featured" className="text-sm text-charcoal/80 cursor-pointer">Set as Featured/Spotlight Partner</label>
        </div>
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !form.name}
            className="bg-charcoal text-cream px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-black disabled:opacity-50 transition-colors border border-charcoal disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : editing ? 'Update Charity' : 'Add Charity'}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setForm(empty) }}
              className="bg-white border border-charcoal/20 px-8 py-3 text-xs uppercase tracking-widest font-medium text-charcoal hover:bg-charcoal/5 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-charcoal/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-charcoal/5 text-charcoal/60 uppercase tracking-widest text-[10px] font-medium border-b border-charcoal/10">
            <tr>
              {['Name', 'Featured', 'Description', 'Actions'].map(h => (
                <th key={h} className="text-left px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {charities.map(c => (
              <tr key={c.id} className="border-b border-charcoal/5 hover:bg-cream/30 transition-colors last:border-0">
                <td className="px-6 py-4 font-heading text-lg text-charcoal">{c.name}</td>
                <td className="px-6 py-4">
                  {c.is_featured
                    ? <span className="text-[10px] uppercase tracking-widest px-3 py-1 font-bold border bg-olive/10 text-olive border-olive/20">Featured</span>
                    : <span className="text-charcoal/40">—</span>
                  }
                </td>
                <td className="px-6 py-4 text-charcoal/70 max-w-xs truncate">{c.description}</td>
                <td className="px-6 py-4 flex gap-4 mt-1">
                  <button onClick={() => handleEdit(c)} className="text-[10px] uppercase tracking-widest font-bold text-charcoal hover:text-olive transition-colors">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {charities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal/60 text-sm uppercase tracking-widest font-medium">No charities yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}