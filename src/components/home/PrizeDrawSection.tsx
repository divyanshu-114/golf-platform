'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function PrizeDrawSection() {
  return (
    <section id="prizes" className="py-24 md:py-32 bg-charcoal text-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <div>
              <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium mb-4">Monthly Lottery</p>
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-6">
                The Prize Draws
              </h2>
              <p className="text-cream/70 leading-relaxed text-lg">
                Your entered scores act as your lottery numbers. Every month, an algorithm generates random winning scores. Match them to win payouts directly to your account.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { match: '5 Numbers matched', prize: 'Jackpot Prize Pool', color: 'text-yellow-400', icon: '🏆' },
                { match: '4 Numbers matched', prize: 'Tier 2 Prize Pool', color: 'text-slate-300', icon: '🥈' },
                { match: '3 Numbers matched', prize: 'Tier 3 Prize Pool', color: 'text-orange-300', icon: '🥉' }
              ].map((tier, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">{tier.icon}</div>
                  <div>
                    <h4 className={`font-medium ${tier.color}`}>{tier.match}</h4>
                    <p className="text-cream/60 text-sm">{tier.prize}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link 
                href="/pricing"
                className="inline-block bg-olive text-cream px-8 py-3 rounded-none text-sm uppercase tracking-wider hover:bg-[#7a8c54] transition-colors duration-300 border border-olive"
              >
                Join the Next Draw
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 w-full h-[500px] relative rounded-t-full overflow-hidden"
          >
            <Image
              src="/images/golf-ball.png"
              alt="Golf ball ready for a putt"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 to-transparent" />
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
