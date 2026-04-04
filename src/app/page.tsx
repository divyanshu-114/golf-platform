import Navbar from '@/components/Navbar'
import HeroSection from '@/components/home/HeroSection'
import WelcomeSection from '@/components/home/WelcomeSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import PrizeDrawSection from '@/components/home/PrizeDrawSection'

import GallerySection from '@/components/home/GallerySection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <WelcomeSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PrizeDrawSection />
      <GallerySection />
      <Footer />
    </main>
  )
}