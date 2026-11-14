import { MotionConfig } from 'motion/react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutAndGardenSection } from './components/AboutAndGardenSection';
import { ExperienceAndTipsSection } from './components/ExperienceAndTipsSection';
import { EcoAndVisitSection } from './components/EcoAndVisitSection';
import { CouponEventSection } from './components/CouponEventSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-[#303630]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#234B38] focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-white"
        >
          본문으로 바로가기
        </a>

        <Header />

        <main id="main-content">
          <HeroSection />
          <AboutAndGardenSection />
          <ExperienceAndTipsSection />
          <EcoAndVisitSection />
          <CouponEventSection />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
