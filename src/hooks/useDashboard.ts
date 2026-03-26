import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DashboardData {
  profile: { id: string; full_name: string; charity_id: string | null; charity_contribution_pct: number; role: string } | null
  subscription: { plan: string; status: string; renewal_date: string } | null
  scores: { id: string; score: number; played_on: string; created_at: string }[]
  charity: { charity_id: string | null; charity_contribution_pct: number; charities: { name: string } | null } | null
  winners: { id: string; tier: number; prize_amount: number; verification_status: string; payout_status: string; draws: { month: string } }[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token

        if (!token) {
          setLoading(false)
          return
        }

        const res = await fetch('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          setLoading(false)
          return
        }
        const json = await res.json()
        setData(json)
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