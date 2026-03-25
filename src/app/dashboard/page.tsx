'use client'
import { useDashboard } from '@/hooks/useDashboard'
import SubscriptionCard from '@/components/dashboard/SubscriptionCard'
import CharityCard from '@/components/dashboard/CharityCard'
import WinningsCard from '@/components/dashboard/WinningsCard'
import ScoreEntry from '@/components/ScoreEntry'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const GolfBallScene = dynamic(() => import('@/components/three/GolfBallScene'), { ssr: false })

export default function DashboardPage() {
  const { data, loading } = useDashboard()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="text-center space-y-3">
        <div className="animate-spin w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  )

  const firstName = data?.profile?.full_name?.split(' ')[0] || 'Player'
  const isActive = data?.subscription?.status === 'active'
  const scoreCount = data?.scores?.length ?? 0
  const winCount = data?.winners?.length ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Navbar />

      {/* Hero Section with 3D */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-72">
          <GolfBallScene variant="light" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white" style={{ zIndex: 1 }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Dashboard</p>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-gray-400 mt-2 text-sm">Here&apos;s your GolfGives overview</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isActive
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isActive ? 'Active Member' : 'No Subscription'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-2">
          {[
            { label: 'Scores Entered', value: scoreCount, icon: '⛳', color: 'from-green-500 to-emerald-600' },
            { label: 'Draws Won', value: winCount, icon: '🏆', color: 'from-amber-500 to-orange-600' },
            { label: 'Contribution', value: `${data?.charity?.charity_contribution_pct ?? 10}%`, icon: '💚', color: 'from-pink-500 to-rose-600' },
            { label: 'Next Draw', value: new Date().toLocaleDateString('en-GB', { month: 'short' }), icon: '📅', color: 'from-blue-500 to-indigo-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg shadow-sm`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Score Entry */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm">🏌️</span>
                Enter Score
              </h2>
              <ScoreEntry />
            </div>

            {/* Subscription */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-xs">💳</span>
                  Subscription
                </h2>
              </div>
              <SubscriptionCard subscription={data?.subscription} />
            </div>

          </div>

          {/* Right Column — 1/3 */}
          <div className="space-y-6">

            {/* Charity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center text-xs">💚</span>
                  Your Charity
                </h2>
              </div>
              <CharityCard
                charityName={data?.charity?.charities?.name}
                contributionPct={data?.charity?.charity_contribution_pct ?? 10}
                userId={data?.profile?.id}
              />
            </div>

            {/* Winnings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center text-xs">🏆</span>
                  Winnings
                </h2>
              </div>
              <WinningsCard winners={data?.winners ?? []} />
            </div>

            {/* Draw Eligibility */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Monthly Draw</p>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isActive ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {isActive ? '✓' : '✗'}
                </div>
                <div>
                  <p className="font-semibold">{isActive ? 'You\'re eligible!' : 'Not eligible'}</p>
                  <p className="text-xs text-gray-400">
                    {isActive ? 'Your scores are in the next draw' : 'Subscribe to enter draws'}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">Next draw</p>
                <p className="font-bold text-lg">
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