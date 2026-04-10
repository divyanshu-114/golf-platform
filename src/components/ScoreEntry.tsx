'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Score {
  id: string
  score: number
  played_on: string
  created_at: string
}

async function getAccessToken() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

export default function ScoreEntry() {
  const [scores, setScores] = useState<Score[]>([])
  const [newScore, setNewScore] = useState('')
  const [playedOn, setPlayedOn] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchScores = async () => {
    const token = await getAccessToken()
    if (!token) return
    const res = await fetch('/api/scores', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setScores(data.scores ?? [])
  }

  useEffect(() => {
    void fetchScores()
  }, [])

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    const score = parseInt(newScore)

    if (isNaN(score) || score < 1 || score > 45) {
      return setError('Score must be between 1 and 45')
    }
    if (!playedOn) return setError('Please select a date')

    setLoading(true)
    const token = await getAccessToken()
    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score, played_on: playedOn })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error)

    setSuccess('Score added!')
    setNewScore('')
    setPlayedOn('')
    fetchScores()
  }

  const handleDelete = async (id: string) => {
    const token = await getAccessToken()
    await fetch(`/api/scores/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchScores()
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    })

  const avgScore = scores.length
    ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1)
    : null

  return (
    <div className="space-y-6">

      {/* Score List */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Scores</h2>
          {avgScore && (
            <span className="text-sm text-black">Avg: <strong>{avgScore}</strong></span>
          )}
        </div>

        {scores.length === 0 ? (
          <p className="text-charcoal/60 text-sm italic">No scores yet. Add your first round below.</p>
        ) : (
          <div className="space-y-2">
            {scores.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-3 border-b border-charcoal/5 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-charcoal/40 w-4">{i + 1}</span>
                  <div>
                    <p className="font-bold text-lg text-charcoal">{s.score} pts</p>
                    <p className="text-xs text-charcoal/60">{formatDate(s.played_on)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1 bg-charcoal/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-olive rounded-full"
                      style={{ width: `${(s.score / 45) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-[10px] uppercase tracking-widest text-charcoal/40 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Score Form */}
      <div className="bg-white rounded-none border border-charcoal/10 p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-[0.2em] text-charcoal font-medium">Add New Score</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="1"
            max="45"
            placeholder="Stableford Score"
            value={newScore}
            onChange={e => setNewScore(e.target.value)}
            className="bg-white border border-charcoal/10 rounded-none px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-olive transition-colors"
          />
          <input
            type="date"
            value={playedOn}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setPlayedOn(e.target.value)}
            className="bg-white border border-charcoal/10 rounded-none px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-olive transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/5 border border-red-500/20 p-3">{error}</p>
        )}
        {success && (
          <p className="text-olive text-sm bg-olive/10 border border-olive/20 p-3">{success}</p>
        )}

        {scores.length >= 5 ? (
          <div className="bg-charcoal text-cream p-4 text-sm font-medium border border-charcoal text-center mt-6">
            🏌️ You&apos;ve entered 5 scores. Maximum reached.
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !newScore || !playedOn}
            className="w-full bg-olive text-cream font-medium tracking-widest uppercase text-xs py-4 hover:bg-[#7a8c54] disabled:opacity-50 transition-colors border border-olive disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Add Score'}
          </button>
        )}
      </div>
    </div>
  )
}