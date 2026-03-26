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
            <span className="text-sm text-gray-500">Avg: <strong>{avgScore}</strong></span>
          )}
        </div>

        {scores.length === 0 ? (
          <p className="text-gray-500 text-sm">No scores yet. Add your first round below.</p>
        ) : (
          <div className="space-y-2">
            {scores.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-lg">{s.score} pts</p>
                    <p className="text-xs text-gray-500">{formatDate(s.played_on)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${(s.score / 45) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500">
          {scores.length}/5 scores stored
          {scores.length === 5 && ' — adding a new score will remove the oldest'}
        </p>
      </div>

      {/* Add Score Form */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add New Score</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Stableford Score</label>
            <input
              type="number"
              min={1}
              max={45}
              value={newScore}
              onChange={e => setNewScore(e.target.value)}
              placeholder="e.g. 36"
              className="w-full border rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Date Played</label>
            <input
              type="date"
              value={playedOn}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setPlayedOn(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : 'Add Score'}
        </button>
      </div>
    </div>
  )
}