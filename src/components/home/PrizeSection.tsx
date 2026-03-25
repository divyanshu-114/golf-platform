'use client'
import { motion } from 'framer-motion'

const tiers = [
  { icon: '🏆', label: '5-Number Match', share: '40%', tag: 'Jackpot', color: 'from-yellow-400 to-amber-500', rollover: true },
  { icon: '🥈', label: '4-Number Match', share: '35%', tag: 'Big Prize', color: 'from-gray-300 to-gray-400', rollover: false },
  { icon: '🥉', label: '3-Number Match', share: '25%', tag: 'Prize', color: 'from-orange-300 to-orange-400', rollover: false },
]

export default function PrizeSection() {
  return (
    <section id="prizes" className="py-24 bg-gray-50 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Monthly draws</p>
          <h2 className="text-4xl font-bold">Three ways to win</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Your Stableford scores become your lucky numbers. Match enough and you win a share of that month&apos;s prize pool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-2xl p-8 text-center space-y-4 ${i === 0 ? 'bg-black text-white' : 'bg-white border'}`}
            >
              <span className="text-4xl">{tier.icon}</span>
              <div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                  ${i === 0 ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {tier.tag}
                </span>
              </div>
              <p className={`text-5xl font-bold ${i === 0 ? 'text-white' : 'text-black'}`}>{tier.share}</p>
              <p className={`text-sm font-medium ${i === 0 ? 'text-gray-300' : 'text-gray-500'}`}>of monthly prize pool</p>
              <p className={`text-sm ${i === 0 ? 'text-gray-400' : 'text-gray-500'}`}>{tier.label}</p>
              {tier.rollover && (
                <p className="text-xs text-amber-400 font-medium">🔁 Rolls over if unclaimed</p>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          Prize pool grows with every subscriber. Split equally among multiple winners in the same tier.
        </p>
      </div>
    </section>
  )
}