'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-24 bg-black text-white px-6">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="text-xs uppercase tracking-widest text-gray-500">Ready to start?</p>
          <h2 className="text-5xl font-bold leading-tight">
            Play with purpose.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Win with meaning.
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join hundreds of golfers who play for more than just the scorecard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/pricing"
            className="bg-white text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-gray-100 transition hover:scale-105 active:scale-95">
            Get Started — £9.99/mo
          </Link>
          <Link href="/charities"
            className="border border-white/20 text-white px-10 py-4 rounded-full text-sm hover:bg-white/10 transition">
            Browse charities
          </Link>
        </motion.div>

        <p className="text-xs text-gray-600">No hidden fees · Cancel anytime · Min 10% to charity</p>
      </div>
    </section>
  )
}