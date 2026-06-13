export default function AboutSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <h2 className="font-['Space_Grotesk'] text-3xl font-bold mb-4 text-white">A New Dimension of Work</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 md:p-10 rounded-2xl relative overflow-hidden group card-hover">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#06B6D4]"></div>
          <span className="material-symbols-outlined text-4xl text-[#06B6D4] mb-6">person_play</span>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-4 text-white">Personal Realm</h3>
          <p className="text-[#c6c6cd] font-['Inter'] text-base leading-relaxed">
            Navigate your private orbit. Manage life goals, fitness constellations, and creative missions with an interface designed for deep focus and personal growth.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest border border-[#06B6D4]/50 text-[#06B6D4]">Solo Mission</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest border border-white/10 text-white/40">Private</span>
          </div>
        </div>

        <div className="glass p-8 md:p-10 rounded-2xl relative overflow-hidden group card-hover">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]"></div>
          <span className="material-symbols-outlined text-4xl text-[#8B5CF6] mb-6">groups</span>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-4 text-white">Professional Clusters</h3>
          <p className="text-[#c6c6cd] font-['Inter'] text-base leading-relaxed">
            Synchronize with your crew. Orchestrate complex project clusters, assign planetary task leads, and track collective velocity in real-time.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest border border-[#8B5CF6]/50 text-[#8B5CF6]">Squad Mode</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest border border-white/10 text-white/40">Synced</span>
          </div>
        </div>
      </div>
    </section>
  );
}