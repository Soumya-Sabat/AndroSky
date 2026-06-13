"use client"
import ContactForm from '@/component/landing/ContactForm';

export const metadata = {
  title: 'Contact Us - AndroSky',
  description: 'Get in touch with the AndroSky team. Send us your questions, feedback, or just say hello!',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
      {/* Main Content Area */}
      <main className="flex-grow relative pt-32 pb-20 overflow-hidden">
        
        {/* Animated Nebula Background Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px] opacity-10 animate-pulse animation-delay-1000"></div>
          
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                  width: Math.random() * 2 + 1 + 'px',
                  height: Math.random() * 2 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 5 + 's',
                  opacity: Math.random() * 0.5 + 0.2
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Page Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk'] text-white">
              Establish Comm Link
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mb-6"></div>
            <p className="text-[#c6c6cd] text-lg max-w-2xl mx-auto font-['Inter']">
              Have questions about AndroSky? Want to collaborate? Or just want to say hi? 
              Our subspace receivers are always on.
            </p>
          </div>
          
          <ContactForm />
          
          <div className="text-center mt-12 text-[#909097] text-sm font-['JetBrains_Mono']">
            <p>I'll get back to you within 24-48 hours. </p>
          </div>
        </div>
      </main>
    </div>
  )
}