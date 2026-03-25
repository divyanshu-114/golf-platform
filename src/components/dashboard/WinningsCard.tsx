interface Winner {
  id: string
  tier: number
  prize_amount: number
  verification_status: string
  payout_status: string
  draws: { month: string }
}

interface Props { winners: Winner[] }

const tierLabel = (t: number) => t === 5 ? '🏆 Jackpot' : t === 4 ? '🥈 4-Match' : '🥉 3-Match'

const payoutBadge: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
}

const verifyBadge: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-500',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default function WinningsCard({ winners }: Props) {
  const total = winners
    .filter(w => w.payout_status === 'paid')
    .reduce((sum, w) => sum + w.prize_amount, 0)

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide">Winnings</p>
        <p className="text-sm font-bold text-green-600">£{total.toFixed(2)} total paid</p>
      </div>

      {winners.length === 0 ? (
        <p className="text-gray-400 text-sm">No winnings yet — keep playing!</p>
      ) : (
        <div className="space-y-3">
          {winners.map(w => (
            <div key={w.id} className="flex items-center justify-between text-sm border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{tierLabel(w.tier)}</p>
                <p className="text-xs text-gray-400">
                  {new Date(w.draws.month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">£{w.prize_amount.toFixed(2)}</p>
                <div className="flex gap-1 justify-end">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${verifyBadge[w.verification_status]}`}>
                    {w.verification_status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${payoutBadge[w.payout_status]}`}>
                    {w.payout_status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}