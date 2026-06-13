"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#131315]/10 backdrop-blur-md border-b border-white/10 shadow-[0_0_20px_rgba(190,198,224,0.05)]">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <a 
          href="/"
          className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold tracking-tighter text-[#dae2fd]">
            AndroSky
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-sm font-medium text-[#bec6e0] hover:text-[#bec6e0] hover:underline transition-colors" href="/missions">Missions</a>
          <a className="text-sm font-medium text-[#c6c6cd] hover:text-[#bec6e0] hover:underline transition-colors" href="/clusters">Clusters</a>
          <a className="text-sm font-medium text-[#c6c6cd] hover:text-[#bec6e0] hover:underline transition-colors" href="/academy">Academy</a>
          <a className="text-sm font-medium text-[#c6c6cd] hover:text-[#bec6e0] hover:underline transition-colors" href="/galaxymap">Galaxy Map</a>
        </div>
        <div className="flex items-center gap-4">
          <Link
          href="/login"
          className="hidden lg:block text-[#c6c6cd] hover:text-[#bec6e0] transition-colors text-sm font-medium">Login</Link>
          <Link 
          href="/register"
          className="button-gradient px-5 py-2 rounded-full font-['JetBrains_Mono'] text-white text-xs uppercase tracking-wider neon-glow-cyan active:scale-95">
            Launch Odyssey
          </Link>
        </div>
      </nav>
    </header>
  );
}