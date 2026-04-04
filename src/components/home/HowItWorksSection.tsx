'use client'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Subscribe',
    desc: 'Join the platform with a flexible monthly or annual plan to gain access to all features and weekly draws.'
  },
  {
    number: '02',
    title: 'Enter Scores',
    desc: 'Play a round of golf and enter your Stableford scores directly into your dashboard. Up to 5 scores per month.'
  },
  {
    number: '03',
    title: 'Win Prizes',
    desc: 'Your scores are automatically entered into our monthly algorithm draw. Match 3, 4, or 5 numbers to win cash.'
  },
  {
    number: '04',
    title: 'Give Back',
    desc: 'Select a charity close to your heart. A guaranteed minimum of 10% of your subscription goes to them.'
  }
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-cream text-charcoal relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium mb-4">Setup in minutes</p>
            <h2 className="font-heading text-4xl md:text-5xl">How It Works</h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/3"
          >
            <p className="text-charcoal/70">
              A seamless experience designed to reward your passion for golf while making a positive impact on the community.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative group"
            >
              {/* Connector line for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-full h-[1px] bg-charcoal/10" />
              )}
              
              <div className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center font-heading text-xl text-olive mb-6 bg-cream relative z-10 group-hover:bg-olive group-hover:text-cream group-hover:border-olive transition-colors duration-300">
                {step.number}
              </div>
              <h3 className="font-heading text-2xl mb-3">{step.title}</h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
