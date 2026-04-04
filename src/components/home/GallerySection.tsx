'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const galleryImages = [
  { id: 'gallery-1', src: '/images/scenic-course.png', alt: 'Scenic golf course aerial view', span: 'col-span-2 row-span-2' },
  { id: 'gallery-2', src: '/images/hero-golfer.png', alt: 'Golfer mid-swing at sunset', span: 'col-span-1 row-span-1' },
  { id: 'gallery-3', src: '/images/lady-golfer.png', alt: 'Lady golfer portrait', span: 'col-span-1 row-span-1' },
  { id: 'gallery-4', src: '/images/golf-ball.png', alt: 'Golf ball on green', span: 'col-span-1 row-span-1' },
  { id: 'gallery-5', src: '/images/room-1.png', alt: 'Luxury resort room', span: 'col-span-1 row-span-1' },
  { id: 'gallery-6', src: '/images/room-2.png', alt: 'Elegant suite interior', span: 'col-span-2 row-span-1' },
  { id: 'gallery-7', src: '/images/hero-golfer.png', alt: 'Golf course view', span: 'col-span-1 row-span-1' },
  { id: 'gallery-8', src: '/images/golf-ball.png', alt: 'Close-up golf detail', span: 'col-span-1 row-span-1' },
]

export default function GallerySection() {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium mb-4">
            Discover
          </p>
          <h2 className="font-heading text-charcoal text-4xl md:text-5xl">
            Our Gallery
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden group cursor-pointer ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-500 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl">
                  +
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
