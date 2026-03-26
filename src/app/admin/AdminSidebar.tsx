'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: '📊 Overview' },
  { href: '/admin/users', label: '👥 Users' },
  { href: '/admin/draws', label: '🎲 Draws' },
  { href: '/admin/charities', label: '💚 Charities' },
  { href: '/admin/winners', label: '🏆 Winners' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside className="w-56 bg-white border-r flex flex-col py-8 px-4 fixed h-full z-10">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 px-3 mb-4">Admin Panel</p>
      <div className="space-y-1 flex-1">
        {navItems.map(({ href, label }) => (
          <Link key={href} href={href}
            className={`block px-3 py-2 rounded-xl text-sm font-medium transition
              ${pathname === href ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="mt-auto mx-1 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition flex items-center gap-2"
      >
        🚪 Logout
      </button>
    </aside>
  )
}
