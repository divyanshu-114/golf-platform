import Navbar from '@/components/Navbar'
import HeroSection from '@/components/home/HeroSection'
import HowItWorks from '@/components/home/HowItWorks'
import ImpactSection from '@/components/home/ImpactSection'
import FeaturedCharity from '@/components/home/FeaturedCharity'
import PrizeSection from '@/components/home/PrizeSection'
import FinalCTA from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ImpactSection />
      <FeaturedCharity />
      <PrizeSection />
      <FinalCTA />
    </main>
  )
}