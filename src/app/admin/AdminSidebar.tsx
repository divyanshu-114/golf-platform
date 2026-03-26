'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin', label: '📊 Overview' },
  { href: '/admin/users', label: '👥 Users' },
  { href: '/admin/draws', label: '🎲 Draws' },
  { href: '/admin/charities', label: '💚 Charities' },
  { href: '/admin/winners', label: '🏆 Winners' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-white border-r flex flex-col py-8 px-4 space-y-1 fixed h-full z-10">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-4">Admin Panel</p>
      {navItems.map(({ href, label }) => (
        <Link key={href} href={href}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition
            ${pathname === href ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          {label}
        </Link>
      ))}
    </aside>
  )
}
