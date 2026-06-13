import TopNavBar from '@/components/landing/TopNavBar';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Establish Link | NebulaTasks Support',
  description: 'Transmit signals directly to the NebulaTasks operations deck.',
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-24 overflow-hidden">
      {/* Background Layer Uniformity Mirroring App Concept */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0F172A]/90 z-10"></div>
        <img 
          alt="Cosmic space styling background" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80"
        />
      </div>

      <TopNavBar />
      <div className="my-auto">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}