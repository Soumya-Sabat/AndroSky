export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0F172A]/75 z-10"></div>
        {/* Always matching background theme space texture */}
        <img 
          alt="Cosmic productivity background" 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80"
        />
        <div className="star-streak w-64 top-1/4 left-1/4" style={{ animationDelay: '0s' }}></div>
        <div className="star-streak w-48 top-1/2 left-1/3" style={{ animationDelay: '1.5s' }}></div>
        <div className="star-streak w-80 top-1/3 right-1/4" style={{ animationDelay: '0.8s' }}></div>
      </div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-[#bec6e0]/30 bg-[#bec6e0]/10 backdrop-blur-sm">
          <span className="font-['JetBrains_Mono'] text-xs text-[#bec6e0] uppercase tracking-[0.2em]">Next-Gen Task Management</span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-[64px] mb-6 leading-tight font-bold tracking-wide text-white">
          Productivity, <br />
          <span className="gradient-text">Written in the Stars</span>
        </h1>
        <p className="font-['Inter'] text-lg text-[#c6c6cd] mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform your daily grind into a cosmic journey. Organize your workflow into mission clusters, earn rewards, and conquer your galaxy of tasks with our gamified odyssey system.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="button-gradient px-8 py-4 rounded-full font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider neon-glow-cyan w-full sm:w-auto">
            Launch Your Odyssey
          </button>
          <button className="px-8 py-4 rounded-full font-['Space_Grotesk'] font-bold border border-white/20 glass hover:bg-white/10 transition-all w-full sm:w-auto text-white">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}