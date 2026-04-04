'use client'
import { useDashboard } from '@/hooks/useDashboard'
import SubscriptionCard from '@/components/dashboard/SubscriptionCard'
import CharityCard from '@/components/dashboard/CharityCard'
import WinningsCard from '@/components/dashboard/WinningsCard'
import ScoreEntry from '@/components/ScoreEntry'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {
  const { data, loading } = useDashboard()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-olive/20 border-t-olive rounded-full animate-spin mx-auto" />
        <p className="text-sm text-charcoal/60 uppercase tracking-widest font-medium">Loading Dashboard</p>
      </div>
    </div>
  )

  const firstName = data?.profile?.full_name?.split(' ')[0] || 'Player'
  const isActive = data?.subscription?.status === 'active'
  const scoreCount = data?.scores?.length ?? 0
  const winCount = data?.winners?.length ?? 0

  return (
    <div className="min-h-screen bg-[#F9F8F3]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-charcoal pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-olive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-olive uppercase tracking-[0.3em] text-xs font-medium mb-3">Dashboard</p>
            <h1 className="font-heading text-4xl text-cream tracking-wide">GolfGives</h1>
            <p className="text-cream/70 mt-3 font-light">Here&apos;s your dashboard overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider border ${
              isActive
                ? 'bg-olive/10 text-olive border-olive/30'
                : 'bg-white/5 text-white/50 border-white/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-olive shadow-[0_0_8px_rgba(141,160,103,0.8)]' : 'bg-white/30'}`} />
              {isActive ? 'Active Member' : 'No Subscription'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-20">
          {[
            { label: 'Scores Entered', value: scoreCount, icon: '🏌️' },
            { label: 'Draws Won', value: winCount, icon: '🏆' },
            { label: 'Contribution', value: `${data?.charity?.charity_contribution_pct ?? 10}%`, icon: '💚' },
            { label: 'Next Draw', value: new Date().toLocaleDateString('en-GB', { month: 'short' }), icon: '📅' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border text-center border-charcoal/10 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-cream text-olive flex items-center justify-center text-lg mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="font-heading text-2xl text-charcoal mb-1">{stat.value}</p>
              <p className="text-xs text-charcoal/60 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Score Entry */}
            <div className="bg-white border border-charcoal/10 p-8 shadow-sm">
              <h2 className="font-heading text-xl text-charcoal mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-cream text-olive flex items-center justify-center text-sm">🏌️</span>
                Enter Score
              </h2>
              <ScoreEntry />
            </div>

            {/* Subscription */}
            <div className="bg-white border border-charcoal/10 shadow-sm">
              <div className="px-8 pt-6 pb-2 border-b border-charcoal/5">
                <h2 className="text-xs text-olive uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                  <span className="text-sm">💳</span> Subscription
                </h2>
              </div>
              <div className="p-2">
                <SubscriptionCard subscription={data?.subscription ?? null} />
              </div>
            </div>

          </div>

          {/* Right Column — 1/3 */}
          <div className="space-y-6">

            {/* Charity */}
            <div className="bg-white border border-charcoal/10 shadow-sm">
              <div className="px-6 pt-6 pb-2 border-b border-charcoal/5">
                <h2 className="text-xs text-olive uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                  <span className="text-sm">💚</span> Your Charity
                </h2>
              </div>
              <div className="p-2">
                <CharityCard
                  charityName={data?.charity?.charities?.name ?? null}
                  contributionPct={data?.charity?.charity_contribution_pct ?? 10}
                  userId={data?.profile?.id ?? ''}
                />
              </div>
            </div>

            {/* Winnings */}
            <div className="bg-white border border-charcoal/10 shadow-sm">
              <div className="px-6 pt-6 pb-2 border-b border-charcoal/5">
                <h2 className="text-xs text-olive uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                  <span className="text-sm">🏆</span> Winnings
                </h2>
              </div>
              <div className="p-2">
                <WinningsCard winners={data?.winners ?? []} />
              </div>
            </div>

            {/* Draw Eligibility */}
            <div className="bg-charcoal p-8 text-cream shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-olive/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <p className="text-xs text-olive uppercase tracking-[0.2em] font-medium mb-4">Monthly Draw</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 flex flex-shrink-0 items-center justify-center text-xl border ${
                  isActive ? 'bg-olive/10 border-olive/30 text-olive' : 'bg-red-900/20 border-red-500/30 text-red-400'
                }`}>
                  {isActive ? '✓' : '✕'}
                </div>
                <div>
                  <p className="font-heading text-lg">{isActive ? 'You\'re eligible!' : 'Not eligible'}</p>
                  <p className="text-sm text-cream/60">
                    {isActive ? 'Your scores are in the next draw' : 'Subscribe to enter draws'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-xs text-cream/60 uppercase tracking-widest mb-1">Next Draw</p>
                <p className="font-heading text-xl">
                  End of {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}