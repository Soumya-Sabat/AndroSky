
import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'

export const metadata = {
  title: 'Authentication - Androsky',
  description: 'Login or join the Androsky odyssey with passwordless authentication.',
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="flex-grow relative pt-32 pb-20 overflow-hidden">
        {/* Animated Nebula Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px] opacity-10 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-[128px] opacity-5 animate-pulse animation-delay-2000"></div>
          
          {/* Twinkling Stars */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
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
        
        <div className="relative z-10 container mx-auto px-6">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}