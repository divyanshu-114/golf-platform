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
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <h2 className="text-lg font-semibold">Recent Draws</h2>

      {draws.length === 0 ? (
        <p className="text-gray-400 text-sm">No draws published yet.</p>
      ) : (
        <div className="space-y-4">
          {draws.map(draw => {
            const userNums = userEntries[draw.id] ?? []
            const matches = userNums.length > 0
              ? countMatches(userNums, draw.winning_numbers)
              : null

            return (
              <div key={draw.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {new Date(draw.month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  </p>
                  {matches !== null && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      matches >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      matches >= 4 ? 'bg-blue-100 text-blue-700' :
                      matches >= 3 ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {matches >= 3 ? `🏅 ${matches} Matches!` : `${matches} Matches`}
                    </span>
                  )}
                </div>

                {/* Winning Numbers */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Winning Numbers</p>
                  <div className="flex gap-2">
                    {draw.winning_numbers?.map((n: number) => (
                      <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                        ${userNums.includes(n) ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User's numbers */}
                {userNums.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Your Numbers</p>
                    <div className="flex gap-2">
                      {userNums.map((n: number) => (
                        <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2
                          ${draw.winning_numbers?.includes(n) ? 'border-black text-black' : 'border-gray-200 text-gray-400'}`}>
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {draw.jackpot_rollover > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    🔁 Jackpot rolled over: £{draw.jackpot_rollover.toFixed(2)} added to next month
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}