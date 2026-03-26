'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

interface Charity {
  id: string
  name: string
  description: string
  image_url: string | null
  is_featured: boolean
  charity_events: { id: string; title: string; event_date: string }[]
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCharities = async (q = '') => {
    const res = await fetch(`/api/charities?search=${q}`)
    const data = await res.json()
    setCharities(data.charities ?? [])
    setLoading(false)
  }

  useEffect(() => { void fetchCharities() }, [])

   
  useEffect(() => {
    setLoading(true)
    const delay = setTimeout(() => fetchCharities(search), 300)
    return () => clearTimeout(delay)
  }, [search])

  const featured = charities.filter(c => c.is_featured)
  const rest = charities.filter(c => !c.is_featured)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <BackButton />
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Our Charities</h1>
        <p className="text-gray-600">Every subscription makes a difference. Choose who you support.</p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => { setSearch(e.target.value); setLoading(true); }}
        placeholder="Search charities..."
        className="w-full border rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && !search && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <h2 className="text-lg font-semibold">Spotlight Charity</h2>
              </div>
              {featured.map(c => (
                <Link key={c.id} href={`/charities/${c.id}`}>
                  <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 flex justify-between items-center hover:opacity-90 transition cursor-pointer">
                    <div className="space-y-2">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Featured</span>
                      <h3 className="text-2xl font-bold mt-2">{c.name}</h3>
                      <p className="text-gray-300 text-sm max-w-md">{c.description}</p>
                      {c.charity_events?.length > 0 && (
                        <p className="text-xs text-gray-400">
                          🗓 {c.charity_events.length} upcoming event{c.charity_events.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <span className="text-4xl">💚</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* All Charities */}
          <div className="space-y-4">
            {!search && <h2 className="text-lg font-semibold">All Charities</h2>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(search ? charities : rest).map(c => (
                <Link key={c.id} href={`/charities/${c.id}`}>
                  <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition cursor-pointer space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">💚</div>
                      {c.charity_events?.length > 0 && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          {c.charity_events.length} event{c.charity_events.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
                    </div>
                    <span className="text-xs text-black font-medium underline">View profile →</span>
                  </div>
                </Link>
              ))}
            </div>
            {charities.length === 0 && (
              <p className="text-center text-gray-500 py-12">No charities found.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}