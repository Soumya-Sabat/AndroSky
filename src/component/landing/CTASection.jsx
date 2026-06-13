"use client"
import { useRouter } from "next/navigation";
export default function CTASection() {
  const router = useRouter()
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 text-center border-[#06B6D4]/20 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#06B6D4]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        
        <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold mb-6 relative z-10 text-white">
          Ready to Leave Orbit?
        </h2>
        <p className="text-[#c6c6cd] font-['Inter'] text-lg mb-10 max-w-xl mx-auto relative z-10 leading-relaxed">
          Join over 50,000 commanders managing their life and business with AndroSky. Start your free odyssey today.
        </p>
        <button 
        onClick={()=>router.push("/register")}
        className="button-gradient px-10 py-4 rounded-full font-['Space_Grotesk'] font-bold text-white uppercase tracking-[0.2em] relative z-10 text-sm">
          Join the Fleet
        </button>
        <p className="mt-6 text-white/30 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest relative z-10">
          No Credits Required for Initial Launch • Unlimited Basic Missions
        </p>
      </div>
    </section>
  );
}