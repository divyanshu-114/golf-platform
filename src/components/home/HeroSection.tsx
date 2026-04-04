'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-golfer.png"
          alt="Golfer on a scenic course at sunset"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-charcoal/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-olive uppercase tracking-[0.3em] pl-1 text-xs font-medium mb-6"
          >
            Play. Win. Give Back.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading text-6xl md:text-8xl text-white tracking-wide mb-6"
          >
            Your Game,<br />
            <span className="italic text-cream/90">Rewarded.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-cream/80 max-w-lg text-lg leading-relaxed font-light mb-10"
          >
            Log your golf scores, enter monthly prize draws, and seamlessly support your chosen charities — all in one elegant platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex gap-4"
          >
            <a
              href="/pricing"
              className="bg-olive hover:bg-olive-dark text-white px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-olive/20"
            >
              Get Started
            </a>
            <a
              href="#welcome"
              className="border border-white/30 text-white px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
            >
              Explore
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom icon strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="absolute bottom-0 left-0 right-0 z-10"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-4 border-t border-white/15">
            {[
              { icon: '🏌️', label: 'Score Tracking' },
              { icon: '🏆', label: 'Monthly Draws' },
              { icon: '💚', label: 'Charity Giving' },
              { icon: '📊', label: 'Leaderboards' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-center gap-3 py-6 text-white/70 ${
                  i < 3 ? 'border-r border-white/15' : ''
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs uppercase tracking-widest font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}