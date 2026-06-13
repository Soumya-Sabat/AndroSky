import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import StandoutFeatures from '@/components/landing/StandoutFeatures';
import USPSection from '@/components/landing/USPSection';
import CTASection from '@/components/landing/CTASection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

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