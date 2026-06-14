import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'AndroSky | Productivity, Written in the Stars',
  description: 'Transform your daily grind into a celestial journey with AndroSky. Gamified task management that lets you soar through your tasks.',
};

// Star component for background
function StarBackground() {
  // Generate stars on server side for consistency
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    delay: `${Math.random() * 5}s`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/0 via-[var(--bg-primary)]/50 to-[var(--bg-primary)]"></div>
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
      
      {/* Shooting stars */}
      <div className="absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-white rounded-full animate-shooting-star opacity-0"></div>
      <div className="absolute top-[30%] left-[60%] w-0.5 h-0.5 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-3000"></div>
      <div className="absolute top-[50%] left-[80%] w-0.5 h-0.5 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-5000"></div>
      <div className="absolute top-[70%] left-[15%] w-0.5 h-0.5 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-7000"></div>
      <div className="absolute top-[85%] left-[45%] w-0.5 h-0.5 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-9000"></div>
      
      {/* Nebula glow effects */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[var(--accent-cyan)]/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[var(--accent-purple)]/5 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-tertiary)]/5 rounded-full blur-[150px] animate-pulse animation-delay-4000"></div>
    </div>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased flex flex-col text-[var(--text-on-surface)] relative">
        <StarBackground />
        {/* makes the content float in the bg */}
        <div className="relative z-10"> 
          {children}
        </div>
      </body>
    </html>
  );
}