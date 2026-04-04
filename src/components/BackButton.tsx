'use client'
import { useRouter } from 'next/navigation'

export default function BackButton({ label = '← Back', variant = 'light' }: { label?: string; variant?: 'light' | 'dark' }) {
  const router = useRouter()

  const styles = variant === 'dark'
    ? 'text-white hover:text-cream'
    : 'text-charcoal hover:text-olive'

  return (
    <button
      onClick={() => router.back()}
      className={`text-sm font-medium transition-colors flex items-center gap-2 mb-4 group ${styles}`}
    >
      <span className="group-hover:-translate-x-1 transition-transform">←</span>
      {label.replace('← ', '')}
    </button>
  )
}

