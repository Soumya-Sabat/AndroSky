import Navbar from '@/component/landing/Navbar';
import HeroSection from '@/component/landing/HeroSection';
import AboutSection from '@/component/landing/AboutSection';
import StandoutFeatures from '@/component/landing/StandoutFeatures';
import USPSection from '@/component/landing/USPSection';
import CTASection from '@/component/landing/CTASection';
import ContactSection from '@/component/landing/ContactSection';
import Footer from '@/component/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative min-dvh-">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <StandoutFeatures />
        <USPSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}