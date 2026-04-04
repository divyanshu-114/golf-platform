'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/draws', label: 'Draws' },
  { href: '/admin/charities', label: 'Charities' },
  { href: '/admin/winners', label: 'Winners' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="w-56 bg-charcoal flex flex-col py-8 px-4 fixed h-full z-10 border-r border-charcoal">
      <Link href="/">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cream/50 px-3 mb-8 hover:text-cream transition-colors">← Back to Site</p>
      </Link>
      <div className="space-y-2 flex-1">
        {navItems.map(({ href, label }) => (
          <Link key={href} href={href}
            className={`block px-3 py-3 text-xs tracking-widest uppercase transition-colors
              ${pathname === href ? 'bg-olive text-cream font-medium' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}>
            {label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="mt-auto mx-1 px-3 py-3 text-xs tracking-widest uppercase font-medium text-red-400/80 hover:text-red-400 hover:bg-white/5 transition flex items-center justify-center gap-2 border border-red-400/20"
      >
        Logout
      </button>
    </aside>
  )
}
