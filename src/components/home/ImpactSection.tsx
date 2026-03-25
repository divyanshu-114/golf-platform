'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function CountUp({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { value: 12500, prefix: '£', suffix: '+', label: 'Donated to charity' },
  { value: 847, suffix: '+', label: 'Active subscribers' },
  { value: 24, label: 'Draws completed' },
  { value: 18, label: 'Charities supported' },
]

export default function ImpactSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-950 to-gray-900 text-white px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">Our impact</p>
          <h2 className="text-4xl font-bold">Every swing counts</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Our subscribers don&apos;t just play — they give. Here&apos;s what we&apos;ve achieved together.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center space-y-2 bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <p className="text-4xl font-bold text-white">
                <CountUp target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}