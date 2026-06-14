"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#131315]/80 backdrop-blur-md border-b border-white/10 shadow-[0_0_20px_rgba(190,198,224,0.05)]">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto relative">
        
        {/* Left Side: Brand Identity */}
        <div className="flex items-center gap-2">
          <Link 
            href="/"
            className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold tracking-tighter text-[#dae2fd]"
          >
            AndroSky
          </Link>
        </div>

        {/* Center: Desktop-Only Link Matrix Array */}
        <div className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium text-[#bec6e0] hover:underline transition-colors" href="/missions">Missions</Link>
          <Link className="text-sm font-medium text-[#c6c6cd] hover:text-[#bec6e0] hover:underline transition-colors" href="/clusters">Clusters</Link>
          <Link className="text-sm font-medium text-[#c6c6cd] hover:text-[#bec6e0] hover:underline transition-colors" href="/academy">Academy</Link>
          <Link className="text-sm font-medium text-[#c6c6cd] hover:text-[#bec6e0] hover:underline transition-colors" href="/galaxymap">Galaxy Map</Link>
        </div>

        {/* Right Side: Command Action Core Layout */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/login"
            className="hidden md:block text-[#c6c6cd] hover:text-[#bec6e0] transition-colors text-sm font-medium"
          >
            Login
          </Link>

          {/* Desktop-Only Launch Odyssey Button */}
          <Link 
            href="/register"
            className="hidden md:block button-gradient px-5 py-2 rounded-full font-['JetBrains_Mono'] text-white text-xs uppercase tracking-wider neon-glow-cyan active:scale-95 transition-transform"
          >
            Launch Odyssey
          </Link>

          {/* Mobile UFO Drawer Trigger Icon Button */}
          <button 
            onClick={toggleMenu}
            aria-label="Toggle Navigation Sector Grid"
            className="block md:hidden p-1 text-[#c6c6cd] hover:text-cyan-400 focus:outline-none transition-colors relative z-50 group"
          >
            <svg 
              className={`w-8 h-8 transform transition-transform duration-300 ${isOpen ? "rotate-12 scale-110 text-cyan-400" : "group-hover:-translate-y-0.5"}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Outer Cockpit Shield Ring */}
              <path d="M12 3a4 4 0 0 1 4 4v1H8V7a4 4 0 0 1 4-4z" fill={isOpen ? "rgba(34,211,238,0.2)" : "none"} />
              {/* Main Disc Hull Profile Hull */}
              <path d="M2 11.5c0-1.8 4.5-3.5 10-3.5s10 1.7 10 3.5c0 1.5-3 3-8 3.4V17h-4v-2.1c-5-.4-8-1.9-8-3.4z" />
              {/* Lower Propulsion Core Ring */}
              <path d="M9 17h6M10 20h4" />
              {/* Dynamic Anti-Grav Light Beams */}
              {isOpen ? (
                <>
                  <line x1="8" y1="20" x2="6" y2="23" className="animate-pulse" />
                  <line x1="12" y1="20" x2="12" y2="23" className="animate-pulse" />
                  <line x1="16" y1="20" x2="18" y2="23" className="animate-pulse" />
                </>
              ) : (
                <>
                  <circle cx="6" cy="11.5" r="0.5" fill="currentColor" />
                  <circle cx="12" cy="11.5" r="0.5" fill="currentColor" />
                  <circle cx="18" cy="11.5" r="0.5" fill="currentColor" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Subspace Panel Array Sheet */}
        <div className={`absolute top-full left-0 w-full bg-[#131315]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out md:hidden flex flex-col px-6 py-6 space-y-4 shadow-2xl ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}>
          <Link onClick={toggleMenu} className="text-base font-medium text-[#bec6e0] hover:text-cyan-400 py-2 border-b border-white/5" href="/missions">Missions</Link>
          <Link onClick={toggleMenu} className="text-base font-medium text-[#c6c6cd] hover:text-cyan-400 py-2 border-b border-white/5" href="/clusters">Clusters</Link>
          <Link onClick={toggleMenu} className="text-base font-medium text-[#c6c6cd] hover:text-cyan-400 py-2 border-b border-white/5" href="/academy">Academy</Link>
          <Link onClick={toggleMenu} className="text-base font-medium text-[#c6c6cd] hover:text-cyan-400 py-2 border-b border-white/5" href="/galaxymap">Galaxy Map</Link>
          <Link onClick={toggleMenu} className="text-base font-medium text-[#c6c6cd] hover:text-cyan-400 py-2 border-b border-white/5" href="/login">Access Login</Link>
          
          {/* Mobile-Only Launch Odyssey Button placement */}
          <div className="pt-2">
            <Link 
              onClick={toggleMenu}
              href="/register"
              className="button-gradient w-full block text-center py-3 rounded-full font-['JetBrains_Mono'] text-white text-xs uppercase tracking-wider neon-glow-cyan active:scale-95 transition-transform"
            >
              Launch Odyssey
            </Link>
          </div>
        </div>

      </nav>
    </header>
  );
}