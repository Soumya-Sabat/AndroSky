import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'

export const metadata = {
  title: 'Galaxy Map - Your Productivity Journey | NebulaTasks',
  description: 'Visualize your progress through 20 levels of productivity mastery. From Nova Seed to Galaxy Sovereign.',
}

const levels = [
  { level: 1, title: 'Nova Seed', xp: 0, feature: 'Basic Tasks' },
  { level: 2, title: 'Dust Collector', xp: 100, feature: '—' },
  { level: 3, title: 'Ember', xp: 283, feature: 'Custom Themes' },
  { level: 4, title: 'Star Kindler', xp: 520, feature: 'Smart Reminders' },
  { level: 5, title: 'Comet Rider', xp: 800, feature: 'Habits Tracker' },
  { level: 6, title: 'Moon Walker', xp: 1118, feature: 'Join Clusters' },
  { level: 7, title: 'Ring Bearer', xp: 1470, feature: 'Achievements' },
  { level: 8, title: 'Pulsar', xp: 1852, feature: 'Task Templates' },
  { level: 9, title: 'Nebula Lord', xp: 2263, feature: 'Create Clusters' },
  { level: 10, title: 'Galaxy Sovereign', xp: 2700, feature: 'Advanced Analytics' },
]

export default function GalaxyMapPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-16">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
            <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-cyan)] uppercase tracking-[0.2em]">Progression System</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold mb-6 text-white">
            Your Journey Through the{' '}
            <span className="gradient-text">Galaxy</span>
          </h1>
          <p className="text-[var(--text-variant)] text-lg md:text-xl max-w-2xl mx-auto font-['Inter'] leading-relaxed">
            Every task completed brings you closer to the next galaxy. Watch your rank grow 
            as you master the art of productivity.
          </p>
        </div>

        {/* Level Progression Visual */}
        <div className="px-6 max-w-5xl mx-auto mb-20">
          <div className="glass rounded-3xl p-8">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-cyan)] via-[var(--accent-purple)] to-transparent hidden md:block"></div>
              
              {/* Level Items */}
              <div className="space-y-6">
                {levels.map((level, idx) => (
                  <div key={level.level} className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-24 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        idx < 4 ? 'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)]' : 'bg-white/20'
                      }`}>
                        <span className="text-white text-xs font-['JetBrains_Mono']">{level.level}</span>
                      </div>
                      <span className={`font-['Space_Grotesk'] font-bold ${idx < 4 ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        {level.title}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-primary)] font-['JetBrains_Mono']">{level.xp.toLocaleString()} XP</span>
                        <span className="text-xs text-[var(--accent-cyan)]">{level.feature !== '—' ? `🔓 Unlocks: ${level.feature}` : ''}</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                          idx < 4 ? 'w-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)]' : 'w-0'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Unlock Section */}
        <div className="bg-[var(--surface-low)]/40 py-20">
          <div className="px-6 max-w-7xl mx-auto">
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white text-center mb-12">Unlock Features as You Level Up</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { level: 1, title: 'Basic Tasks', desc: 'Create and manage your daily missions' },
                { level: 5, title: 'Habits Tracker', desc: 'Build and maintain daily routines' },
                { level: 6, title: 'Join Clusters', desc: 'Collaborate with teams using codes' },
                { level: 9, title: 'Create Clusters', desc: 'Form your own private groups' },
                { level: 10, title: 'Analytics', desc: 'Deep insights into your productivity' },
                { level: 15, title: 'Goal Tracking', desc: 'Set and track long-term objectives' },
              ].map((feature) => (
                <div key={feature.title} className="glass rounded-xl p-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-['JetBrains_Mono'] text-sm">Lv{feature.level}</span>
                  </div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-[var(--text-primary)] text-xs font-['Inter']">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto text-center mt-20">
          <div className="glass rounded-3xl p-8">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">Begin Your Journey Today</h3>
            <p className="text-[var(--text-primary)] mb-6">Start at Nova Seed and work your way to Galaxy Sovereign.</p>
            <button className="button-gradient px-8 py-3 rounded-full text-white font-['Space_Grotesk'] font-bold">
              Start Your Odyssey
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}