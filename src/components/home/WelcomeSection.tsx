'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function WelcomeSection() {
  return (
    <section id="welcome" className="py-24 md:py-32 bg-cream-light px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium">
              Welcome to GolfGives
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.15] text-charcoal">
              Experience the Perfect Harmony of Golf, Luxury, and Comfort
            </h2>
            <p className="text-charcoal/60 leading-relaxed text-base max-w-lg">
              Discover a place where precision meets paradise. Our world-class courses,
              combined with luxurious amenities and a commitment to giving back, create
              an experience unlike any other. Every subscription supports the charities
              you care about most.
            </p>
            <a
              href="#amenities"
              className="inline-block bg-olive hover:bg-olive-dark text-white px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 mt-4"
            >
              Discover More
            </a>
          </motion.div>

          {/* Right photo collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[500px] md:h-[600px]"
          >
            {/* Top right - lady golfer */}
            <div className="absolute top-0 right-0 w-[55%] h-[55%] rounded-sm overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/lady-golfer.png"
                alt="Lady golfer smiling on course"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Bottom left - golf ball */}
            <div className="absolute bottom-0 left-0 w-[60%] h-[55%] rounded-sm overflow-hidden shadow-2xl z-10">
              <Image
                src="/images/golf-ball.png"
                alt="Golf ball on green grass"
                fill
                sizes="(max-width: 1024px) 100vw, 36vw"
                className="object-cover"
              />
            </div>

            {/* Center brand card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-charcoal text-white px-10 py-6 flex flex-col items-center shadow-2xl">
              <span className="font-heading text-xl md:text-2xl tracking-[0.3em] uppercase">
                GolfGives
              </span>
              <span className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold text-[10px]">★</span>
                ))}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
