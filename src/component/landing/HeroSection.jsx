'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {

  const router =  useRouter()

  // Array of cosmic productivity tags
  const tags = [
    "Next-Gen Task Management",
    "Orchestrate Your Clusters",
    "Zero-Knowledge Privacy",
    "AI-Powered Navigation",
    "Gamified Productivity Hub",
    "Quantum Flow Soundscapes",
    "Sync Across the Fleet"
  ];

  const [currentTagIndex, setCurrentTagIndex] = useState(0);
  const [isFade, setIsFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out slightly before changing text
      setIsFade(true);
      
      setTimeout(() => {
        setCurrentTagIndex((prevIndex) => (prevIndex + 1) % tags.length); // the array will never overflow
        setIsFade(false);
      }, 300); // This matches our transition duration

    }, 1200); // Swaps text roughly every second including animation buffer

    return () => clearInterval(interval);
  }, [tags.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        {/* Dynamic Rotating Tag */}
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-b border-[#bec6e0]/30 bg-[#bec6e0]/10 backdrop-blur-sm h-[30px]">
          <span 
            className={`font-['JetBrains_Mono'] text-s text-amber-300 uppercase tracking-[0.2em] inline-block transition-all duration-300 ${
              isFade ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0'
            }`}
          >
            {tags[currentTagIndex]}
          </span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-4xl md:text-[64px] mb-6 leading-tight font-bold tracking-wide text-white">
          Productivity, <br />
          <span className="gradient-text">Written in the Stars</span>
        </h1>
        <p className="font-['Inter'] text-lg text-[#c6c6cd] mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform your daily grind into a cosmic journey. Organize your workflow into mission clusters, earn rewards, and conquer your galaxy of tasks with our gamified odyssey system.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
          onClick={()=>router.push("/register")}
          className="button-gradient px-8 py-4 rounded-full font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider neon-glow-cyan w-full sm:w-auto border-0">
            Launch Your Odyssey
          </button>
          <a 
          href='https://youtube.com/'
          className="px-8 py-4 rounded-full font-['Space_Grotesk'] font-bold border border-white/20 glass hover:bg-white/10 transition-all w-full sm:w-auto text-white">
            View Demo
          </a>
        </div>
      </div>
    </section>
  );
}