'use client'
import { useRouter } from 'next/navigation'

export default function BackButton({ label = '← Back', variant = 'light' }: { label?: string; variant?: 'light' | 'dark' }) {
  const router = useRouter()

  const styles = variant === 'dark'
    ? 'text-white hover:text-white'
    : 'text-black hover:text-black'

  return (
    <button
      onClick={() => router.back()}
      className={`text-sm transition flex items-center gap-1 mb-4 ${styles}`}
    >
      {label}
    </button>
  )
}

