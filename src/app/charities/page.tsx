'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Charity {
  id: string
  name: string
  description: string
  image_url: string | null
  is_featured: boolean
  website_url: string | null
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
  const filtered = search
    ? charities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      )
    : charities

  return (
    <div className="min-h-screen bg-[#F9F8F3]">
      <Navbar />

      {/* Header */}
      <div className="bg-charcoal pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium mb-3">Community</p>
            <h1 className="font-heading text-4xl md:text-5xl text-white">
              Support Our Charities
            </h1>
            <p className="text-cream/70 mt-3 font-light max-w-2xl text-lg leading-relaxed">
              Every month, a percentage of your subscription goes directly to a cause of your choosing. Browse our vetted partners below.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex-1">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-xl mx-auto md:mx-0">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40">🔍</span>
            <input
              type="text"
              placeholder="Search charities by name or cause..."
              value={search}
              onChange={e => { setSearch(e.target.value); setLoading(true); }}
              className="w-full bg-white border border-charcoal/10 pl-12 pr-4 py-4 focus:outline-none focus:border-olive transition-colors text-charcoal shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-olive/20 border-t-olive rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured Charities */}
            {!search && featured.length > 0 && (
              <div className="mb-16">
                <h2 className="font-heading text-2xl text-charcoal mb-6 border-b border-charcoal/5 pb-4">
                  Featured Partners
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featured.map(charity => (
                    <Link
                      key={charity.id}
                      href={`/charities/${charity.id}`}
                      className="group bg-white border border-olive/20 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-olive/5 rounded-full blur-2xl group-hover:bg-olive/10 transition-colors" />
                      
                      <div className="relative z-10">
                        <span className="inline-block bg-olive/10 text-olive text-xs px-3 py-1 uppercase tracking-widest font-medium mb-4">
                          Featured
                        </span>
                        <h3 className="font-heading text-2xl text-charcoal mb-3 group-hover:text-olive transition-colors">{charity.name}</h3>
                        <p className="text-charcoal/70 line-clamp-2 leading-relaxed">{charity.description}</p>
                      </div>
                      
                      <div className="mt-8 flex items-center text-sm font-medium text-olive uppercase tracking-widest">
                        Learn More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Charities Grid */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-charcoal/5 pb-4">
                <h2 className="font-heading text-2xl text-charcoal">
                  {search ? 'Search Results' : 'All Charities'}
                </h2>
                <span className="text-sm font-medium uppercase tracking-widest text-charcoal/40">
                  {filtered.length} Organizations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filtered.map(charity => (
                  <Link
                    key={charity.id}
                    href={`/charities/${charity.id}`}
                    className="bg-white border border-charcoal/10 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col min-h-[220px]"
                  >
                    <div className="flex-1">
                      <h3 className="font-heading text-xl text-charcoal mb-3">{charity.name}</h3>
                      <p className="text-sm text-charcoal/70 line-clamp-3 leading-relaxed mb-6">
                        {charity.description}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-olive uppercase tracking-widest mt-auto border-t border-charcoal/5 pt-4">
                      View Profile →
                    </p>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 bg-white border border-charcoal/10">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <h3 className="font-heading text-xl text-charcoal mb-2">No charities found</h3>
                  <p className="text-sm text-charcoal/60">Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}