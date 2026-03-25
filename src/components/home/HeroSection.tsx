'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">

      {/* Background subtle grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-4xl space-y-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-white/10 border border-white/20 text-xs px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            🏌️ Play Golf · Win Prizes · Change Lives
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
        >
          Your golf score<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            funds the future
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Subscribe. Enter your Stableford scores. Win monthly prizes.
          And support a charity that matters to you — automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/pricing"
            className="bg-white text-black px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-100 transition hover:scale-105 active:scale-95">
            Start for £9.99/month →
          </Link>
          <Link href="/#how-it-works"
            className="border border-white/30 text-white px-8 py-4 rounded-full text-sm hover:bg-white/10 transition">
            See how it works
          </Link>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 pt-4"
        >
          {['✓ Cancel anytime', '✓ 10% min to charity', '✓ Monthly prize draws', '✓ No golf clichés'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
      >
        <span className="text-xs">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-4 h-4 border-b-2 border-r-2 border-gray-600 rotate-45"
        />
      </motion.div>
    </section>
  )
}