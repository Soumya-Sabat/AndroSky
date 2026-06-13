export default function StandoutFeatures() {
  return (
    <section className="py-24 bg-[#1b1b1d]/40">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-8 glass rounded-2xl card-hover">
            <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 flex items-center justify-center mb-6 neon-glow-cyan border border-[#06B6D4]/30">
              <span className="material-symbols-outlined text-3xl text-[#06B6D4]">rocket</span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-lg font-bold mb-3 text-white">Task Constellations</h4>
            <p className="text-[#c6c6cd] text-sm font-['Inter'] leading-relaxed">Visualize project dependencies as interconnected stars. Map your progress through the void.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 glass rounded-2xl card-hover">
            <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-6 neon-glow-purple border border-[#8B5CF6]/30">
              <span className="material-symbols-outlined text-3xl text-[#8B5CF6]">public</span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-lg font-bold mb-3 text-white">Collaborative Clusters</h4>
            <p className="text-[#c6c6cd] text-sm font-['Inter'] leading-relaxed">Real-time collaboration tools that feel weightless. Share missions across the fleet instantly.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 glass rounded-2xl card-hover">
            <div className="w-16 h-16 rounded-full bg-[#dec29a]/10 flex items-center justify-center mb-6 border border-[#dec29a]/30">
              <span className="material-symbols-outlined text-3xl text-[#dec29a]">star</span>
            </div>
            <h4 className="font-['Space_Grotesk'] text-lg font-bold mb-3 text-white">Cosmic Rewards</h4>
            <p className="text-[#c6c6cd] text-sm font-['Inter'] leading-relaxed">Level up your profile. Unlock new ship skins and cosmic avatars as you complete missions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}