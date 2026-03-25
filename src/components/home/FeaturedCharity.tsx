'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FeaturedCharity() {
  const [charity, setCharity] = useState<{ id: string; name: string; description: string } | null>(null)

  useEffect(() => {
    fetch('/api/charities?featured=true')
      .then(r => r.json())
      .then(d => setCharity(d.charities?.[0] ?? null))
  }, [])

  if (!charity) return null

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-950 to-emerald-900 text-white rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-4 max-w-xl">
            <span className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full">⭐ Spotlight Charity</span>
            <h2 className="text-3xl md:text-4xl font-bold">{charity.name}</h2>
            <p className="text-green-200 leading-relaxed">{charity.description}</p>
            <div className="flex gap-3">
              <Link href={`/charities/${charity.id}`}
                className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition">
                Learn more
              </Link>
              <Link href="/pricing"
                className="border border-white/30 text-white px-6 py-3 rounded-full text-sm hover:bg-white/10 transition">
                Support them →
              </Link>
            </div>
          </div>
          <div className="text-8xl opacity-30">💚</div>
        </motion.div>
      </div>
    </section>
  )
}