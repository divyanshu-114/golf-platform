'use client'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: '💳',
    title: 'Subscribe',
    desc: 'Choose monthly or yearly. Pick a charity you care about. A portion of every payment goes straight to them.'
  },
  {
    number: '02',
    icon: '⛳',
    title: 'Enter Your Scores',
    desc: 'Log your last 5 Stableford scores after each round. Your scores become your draw numbers — no extra steps.'
  },
  {
    number: '03',
    icon: '🏆',
    title: 'Win Monthly Prizes',
    desc: 'Every month we run a draw. Match 3, 4, or all 5 numbers to win your share of the prize pool.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Simple by design</p>
          <h2 className="text-4xl font-bold">How it works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gray-100 z-0" />
              )}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-xs font-bold text-gray-300">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}