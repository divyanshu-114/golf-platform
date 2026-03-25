import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const [profile, subscription, scores, charity, winners] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('scores').select('*').eq('user_id', user.id).order('played_on', { ascending: false }),
          supabase.from('profiles').select('charity_id, charity_contribution_pct, charities(name)').eq('id', user.id).single(),
          supabase.from('winners').select('*, draws(month)').eq('user_id', user.id).order('created_at', { ascending: false })
        ])

        setData({
          profile: profile.data,
          subscription: subscription.data,
          scores: scores.data ?? [],
          charity: charity.data,
          winners: winners.data ?? [],
        })
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading }
}