'use client'

import Link from 'next/link'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-charcoal text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Address */}
          <div className="text-center md:text-left">
            <h4 className="font-heading text-lg mb-4 tracking-wider">Address</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              742 Evergreen Terrace<br />
              Brooklyn, NY 11201
            </p>
          </div>

          {/* Center brand */}
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl md:text-3xl tracking-[0.3em] uppercase mb-1">
              GolfGives
            </span>
            <div className="flex items-center gap-1 mb-6">
              <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L12 8M12 16L12 22M12 8C12 8 8 10 8 14C8 16 10 18 12 16C14 18 16 16 16 14C16 10 12 8 12 8Z" />
              </svg>
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold text-[8px]">★</span>
                ))}
              </span>
            </div>

            {/* Social icons */}
            <div className="flex gap-6">
              {[
                { name: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { name: 'Instagram', path: 'M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zM12 15a3 3 0 110-6 3 3 0 010 6zM17.5 7.5a.5.5 0 110-1 .5.5 0 010 1z' },
                { name: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 11.75a29 29 0 00-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z' },
              ].map(social => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 className="font-heading text-lg mb-4 tracking-wider">Contact Us</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              T. +929 333 9296<br />
              M. contact@golfgives.com
            </p>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-center">
          <p className="text-white/30 text-xs tracking-wider">
            Copyright All Rights Reserved — GolfGives {new Date().getFullYear()}
          </p>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-olive hover:bg-olive-dark flex items-center justify-center text-white transition-colors duration-300"
          aria-label="Back to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
