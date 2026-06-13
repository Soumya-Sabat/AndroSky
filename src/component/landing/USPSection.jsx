export default function USPSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold mb-8 text-white">Why AndroSky?</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="mt-1"><span className="material-symbols-outlined text-[#06B6D4]">security</span></div>
              <div>
                <h5 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">Zero-Knowledge Privacy</h5>
                <p className="text-[#c6c6cd] font-['Inter'] text-sm leading-relaxed">No passwords to remember. We use biometric and hardware-key encryption to ensure your data stays in your sector. No one can access your missions.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="mt-1"><span className="material-symbols-outlined text-[#8B5CF6]">graphic_eq</span></div>
              <div>
                <h5 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">Deep Flow Audio</h5>
                <p className="text-[#c6c6cd] font-['Inter'] text-sm leading-relaxed">Enter a state of hyper-focus with AI-curated space ambient tracks. Generative soundscapes that adapt to your work rhythm.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="mt-1"><span className="material-symbols-outlined text-[#dec29a]">auto_awesome</span></div>
              <div>
                <h5 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">AI Navigator</h5>
                <p className="text-[#c6c6cd] font-['Inter'] text-sm leading-relaxed">Your co-pilot for productivity. It predicts bottlenecks in your schedule and suggests the most efficient route through your task list.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 absolute -inset-4 blur-3xl animate-pulse"></div>
          <div className="glass aspect-[4/3] rounded-2xl p-8 relative flex flex-col justify-center border-white/10">
            <div className="space-y-6">
              <div className="h-4 w-2/3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#06B6D4] w-3/4 rounded-full neon-glow-cyan"></div>
              </div>
              <div className="h-4 w-1/2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#8B5CF6] w-1/2 rounded-full neon-glow-purple"></div>
              </div>
              <div className="h-4 w-5/6 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#dec29a] w-2/3 rounded-full"></div>
              </div>
              <div className="pt-8 grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl text-center">
                  <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#06B6D4] block">1,240</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-white/40 uppercase">XP Earned</span>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <span className="font-['JetBrains_Mono'] text-xl font-bold text-[#8B5CF6] block">Level 42</span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-white/40 uppercase">Commander</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}