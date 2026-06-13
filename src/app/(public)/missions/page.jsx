import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Missions - Turn Tasks into Adventures | AndroSky',
  description: 'Transform your daily to-dos into exciting missions. Earn XP, level up, and make productivity feel like a game.',
}

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
            <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-cyan)] uppercase tracking-[0.2em]">Gamified Productivity</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold mb-6 text-white">
            Turn Tasks Into{' '}
            <span className="gradient-text">Epic Missions</span>
          </h1>
          <p className="text-[var(--text-variant)] text-lg md:text-xl max-w-2xl mx-auto font-['Inter'] leading-relaxed">
            Every task becomes a mission. Every completion earns XP. Watch your productivity 
            transform from a chore into an interstellar adventure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="px-6 max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center card-hover">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-cyan)]/20 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-3xl text-[var(--accent-cyan)]">bolt</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-3">Earn XP</h3>
              <p className="text-[var(--text-primary)] text-sm font-['Inter'] leading-relaxed">
                Every completed task rewards you with experience points. Harder tasks = bigger rewards.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 text-center card-hover">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-3xl text-[var(--accent-purple)]">local_fire_department</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-3">Maintain Streaks</h3>
              <p className="text-[var(--text-primary)] text-sm font-['Inter'] leading-relaxed">
                Daily streaks multiply your rewards. Don't break the chain!
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 text-center card-hover">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-tertiary)]/20 flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-3xl text-[var(--accent-tertiary)]">stars</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-3">Level Up</h3>
              <p className="text-[var(--text-primary)] text-sm font-['Inter'] leading-relaxed">
                Gain levels from Nova Seed to Galaxy Sovereign. Each level unlocks new features.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[var(--surface-low)]/40 py-20 mb-20">
          <div className="px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-4">How Missions Work</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Create Task', desc: 'Add your to-dos as missions in Personal or Professional realm' },
                { step: '02', title: 'Set Difficulty', desc: 'Choose Easy, Medium, Hard, or Epic based on effort' },
                { step: '03', title: 'Complete Mission', desc: 'Get it done and mark as complete' },
                { step: '04', title: 'Earn Rewards', desc: 'Collect XP, Nebula Coins, and maintain streak' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-['JetBrains_Mono'] text-sm">{item.step}</span>
                  </div>
                  <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-[var(--text-primary)] text-sm font-['Inter']">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XP Table Preview */}
        <div className="px-6 max-w-4xl mx-auto mb-20">
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white text-center mb-8">Mission Rewards</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-['JetBrains_Mono'] text-[var(--accent-cyan)]">Difficulty</th>
                  <th className="px-6 py-4 text-left text-sm font-['JetBrains_Mono'] text-[var(--accent-cyan)]">XP Reward</th>
                  <th className="px-6 py-4 text-left text-sm font-['JetBrains_Mono'] text-[var(--accent-cyan)]">Coins (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="px-6 py-3 text-white">Easy</td><td className="px-6 py-3 text-[var(--text-primary)]">10 XP</td><td className="px-6 py-3 text-[var(--text-primary)]">5 ₦</td></tr>
                <tr><td className="px-6 py-3 text-white">Medium</td><td className="px-6 py-3 text-[var(--text-primary)]">25 XP</td><td className="px-6 py-3 text-[var(--text-primary)]">15 ₦</td></tr>
                <tr><td className="px-6 py-3 text-white">Hard</td><td className="px-6 py-3 text-[var(--text-primary)]">50 XP</td><td className="px-6 py-3 text-[var(--text-primary)]">35 ₦</td></tr>
                <tr><td className="px-6 py-3 text-white">Epic</td><td className="px-6 py-3 text-[var(--text-primary)]">100 XP</td><td className="px-6 py-3 text-[var(--text-primary)]">75 ₦</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-8 bg-gradient-to-r from-[var(--accent-cyan)]/5 to-[var(--accent-purple)]/5">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">Ready to Start Your Mission?</h3>
            <p className="text-[var(--text-primary)] mb-6">Join thousands of commanders already leveling up their productivity.</p>
            <button className="button-gradient px-8 py-3 rounded-full text-white font-['Space_Grotesk'] font-bold">
              Launch Your Odyssey
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}