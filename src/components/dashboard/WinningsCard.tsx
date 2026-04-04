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
  pending: 'bg-gray-100 text-black',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default function WinningsCard({ winners }: Props) {
  const total = winners
    .filter(w => w.payout_status === 'paid')
    .reduce((sum, w) => sum + w.prize_amount, 0)

  return (
    <div className="bg-cream/20 rounded-none border border-charcoal/10 p-6 space-y-6">
      <div className="flex justify-between items-end border-b border-charcoal/10 pb-4">
        <p className="text-xs text-charcoal/60 uppercase tracking-widest font-semibold">Winnings</p>
        <p className="text-xl font-heading text-olive">£{total.toFixed(2)}</p>
      </div>

      {winners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-3">🏌️</p>
          <p className="text-charcoal/60 text-sm font-medium tracking-widest uppercase">No Winnings Yet</p>
          <p className="text-xs text-charcoal/40 mt-1">Keep playing and logging scores!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map(w => (
            <div key={w.id} className="flex justify-between items-center border border-charcoal/10 bg-cream/30 p-4">
              <div>
                <p className="font-heading text-lg text-olive border-b border-olive/20 inline-block mb-1">
                  £{w.prize_amount.toFixed(2)}
                </p>
                <p className="text-xs text-charcoal/60 uppercase tracking-widest">
                  {new Date(w.draws.month).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold px-3 py-1 uppercase tracking-widest border ${
                  w.payout_status === 'paid' 
                    ? 'bg-olive/10 text-olive border-olive/20' 
                    : 'bg-yellow-100/50 text-yellow-800 border-yellow-200/50'
                }`}>
                  {w.payout_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}