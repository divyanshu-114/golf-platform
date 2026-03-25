import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSubscription() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single()

      setStatus(data?.status ?? null)
      setLoading(false)
    }
    fetch()
  }, [])

  return { isActive: status === 'active', status, loading }
}