export type DrawMode = 'random' | 'algorithmic'

interface Score { score: number }

// ── Random Mode ──────────────────────────────────────────
// Picks 5 unique numbers between 1–45 at random
export function generateRandomNumbers(): number[] {
  const nums = new Set<number>()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(nums).sort((a, b) => a - b)
}

// ── Algorithmic Mode ─────────────────────────────────────
// Weighted by LEAST frequent scores (rarer = higher win chance)
// This rewards players who scored unusually — more exciting draws
export function generateAlgorithmicNumbers(allScores: Score[]): number[] {
  // Count frequency of each score value
  const freq: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) freq[i] = 0
  allScores.forEach(s => { freq[s.score] = (freq[s.score] || 0) + 1 })

  // Invert frequency — less common = higher weight
  const maxFreq = Math.max(...Object.values(freq)) + 1
  const weights = Object.entries(freq).map(([num, count]) => ({
    num: parseInt(num),
    weight: maxFreq - count
  }))

  // Weighted random selection
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)
  const selected = new Set<number>()

  while (selected.size < 5) {
    let rand = Math.random() * totalWeight
    for (const { num, weight } of weights) {
      rand -= weight
      if (rand <= 0 && !selected.has(num)) {
        selected.add(num)
        break
      }
    }
  }
  return Array.from(selected).sort((a, b) => a - b)
}

// ── Match Checker ─────────────────────────────────────────
export function countMatches(userNumbers: number[], winningNumbers: number[]): number {
  return userNumbers.filter(n => winningNumbers.includes(n)).length
}

// ── Prize Pool Calculator ─────────────────────────────────
export function calculatePrizePools(
  subscriberCount: number,
  subscriptionPrice: number, // per user contribution to pool (e.g. £5 of £9.99)
  jackpotRollover: number = 0
) {
  const totalPool = subscriberCount * subscriptionPrice + jackpotRollover
  return {
    totalPool,
    tier5: parseFloat((totalPool * 0.40).toFixed(2)),
    tier4: parseFloat((totalPool * 0.35).toFixed(2)),
    tier3: parseFloat((totalPool * 0.25).toFixed(2)),
  }
}

// ── Winner Resolver ───────────────────────────────────────
export function resolveWinners(
  entries: { user_id: string; numbers: number[] }[],
  winningNumbers: number[]
) {
  const tiers: Record<number, string[]> = { 5: [], 4: [], 3: [] }

  entries.forEach(entry => {
    const matches = countMatches(entry.numbers, winningNumbers)
    if (matches >= 3) tiers[matches]?.push(entry.user_id)
  })

  return tiers
}