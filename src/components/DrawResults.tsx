'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { countMatches } from '@/lib/drawEngine'

export default function DrawResults({ userId }: { userId: string }) {
  const [draws, setDraws] = useState<{ id: string; month: string; winning_numbers: number[]; jackpot_rollover: number }[]>([])
  const [userEntries, setUserEntries] = useState<Record<string, number[]>>({})

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()

      const { data: published } = await supabase
        .from('draws')
        .select('*')
        .eq('status', 'published')
        .order('month', { ascending: false })
        .limit(6)

      if (!published) return
      setDraws(published)

      // Fetch user's entries for these draws
      const { data: entries } = await supabase
        .from('draw_entries')
        .select('draw_id, numbers')
        .eq('user_id', userId)
        .in('draw_id', published.map((d: { id: string }) => d.id))

      const map: Record<string, number[]> = {}
      entries?.forEach((e: { draw_id: string; numbers: number[] }) => { map[e.draw_id] = e.numbers })
      setUserEntries(map)
    }
    fetch()
  }, [userId])

  return (
    <div className="bg-white border border-charcoal/10 p-6 space-y-5">
      <h2 className="font-heading text-xl text-charcoal border-b border-charcoal/5 pb-3">Recent Draws</h2>

      {draws.length === 0 ? (
        <p className="text-charcoal/60 text-sm">No draws published yet...</p>
      ) : (
        <div className="space-y-4">
          {draws.map(draw => {
            const userNums = userEntries[draw.id] ?? []
            const matches = userNums.length > 0
              ? countMatches(userNums, draw.winning_numbers)
              : null

            return (
              <div key={draw.id} className="border border-charcoal/10 p-5 space-y-4 bg-cream/30">
                <div className="flex justify-between items-center border-b border-charcoal/5 pb-3">
                  <p className="font-medium text-charcoal">
                    {new Date(draw.month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </p>
                  {matches !== null && (
                    <span className={`text-xs font-semibold px-3 py-1 uppercase tracking-widest ${
                      matches >= 5 ? 'bg-yellow-100 text-yellow-800' :
                      matches >= 4 ? 'bg-slate-200 text-slate-800' :
                      matches >= 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-charcoal/5 text-charcoal/60'
                    }`}>
                      {matches >= 3 ? `🏅 ${matches} Matches!` : `${matches} Matches`}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-3">Winning Numbers</p>
                  <div className="flex gap-2">
                    {draw.winning_numbers?.map((n: number) => (
                      <div key={n} className={`w-10 h-10 flex items-center justify-center text-sm font-bold border
                        ${userNums.includes(n) ? 'bg-olive text-cream border-olive' : 'bg-white text-charcoal border-charcoal/10'}`}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User's numbers */}
                {userNums.length > 0 && (
                  <div>
                    <p className="text-xs text-charcoal/60 uppercase tracking-widest mb-3">Your Numbers</p>
                    <div className="flex gap-2">
                      {userNums.map((n: number) => (
                        <div key={n} className={`w-10 h-10 flex items-center justify-center text-sm font-bold border
                          ${draw.winning_numbers?.includes(n) ? 'bg-charcoal text-white border-charcoal' : 'bg-transparent text-charcoal border-charcoal/20'}`}>
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {draw.jackpot_rollover > 0 && (
                  <div className="bg-olive/10 border border-olive/20 p-3 pt-3 mt-4 text-xs font-medium text-olive">
                    🔁 Jackpot rolled over: £{draw.jackpot_rollover.toFixed(2)} added to next month
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// acha