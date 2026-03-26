'use client'
import { useRouter } from 'next/navigation'

export default function BackButton({ label = '← Back', variant = 'light' }: { label?: string; variant?: 'light' | 'dark' }) {
  const router = useRouter()

  const styles = variant === 'dark'
    ? 'text-white/70 hover:text-white'
    : 'text-gray-600 hover:text-black'

  return (
    <button
      onClick={() => router.back()}
      className={`text-sm transition flex items-center gap-1 mb-4 ${styles}`}
    >
      {label}
    </button>
  )
}

