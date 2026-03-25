interface Props {
  subscription: {
    plan: string
    status: string
    renewal_date: string
  } | null
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
  lapsed: 'bg-yellow-100 text-yellow-700',
}

export default function SubscriptionCard({ subscription }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  if (!subscription) return (
    <div className="bg-white rounded-2xl border p-6">
      <p className="text-gray-500 text-sm">No active subscription.</p>
      <a href="/pricing" className="mt-3 inline-block bg-black text-white text-sm px-4 py-2 rounded-xl">
        Subscribe Now
      </a>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Subscription</p>
          <p className="text-xl font-bold capitalize mt-1">{subscription.plan} Plan</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusStyles[subscription.status]}`}>
          {subscription.status}
        </span>
      </div>

      {subscription.renewal_date && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>🗓</span>
          <span>
            {subscription.status === 'cancelled' ? 'Access until' : 'Renews on'}{' '}
            <strong className="text-gray-800">{formatDate(subscription.renewal_date)}</strong>
          </span>
        </div>
      )}

      {subscription.status === 'active' && (
        <button
          onClick={async () => {
            if (!confirm('Cancel your subscription?')) return
            await fetch('/api/stripe/cancel', { method: 'POST' })
            window.location.reload()
          }}
          className="text-xs text-red-400 hover:text-red-600 underline"
        >
          Cancel Subscription
        </button>
      )}
    </div>
  )
}