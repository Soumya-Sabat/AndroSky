import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Academy - Learn Productivity & Gamification | AndroSky',
  description: 'Master productivity techniques, learn gamification strategies, and get the most out of AndroSky.',
}

const resources = [
  { title: 'Getting Started Guide', duration: '5 min', level: 'Beginner', icon: 'rocket' },
  { title: 'Productivity Frameworks', duration: '15 min', level: 'Intermediate', icon: 'psychology' },
  { title: 'Team Collaboration Best Practices', duration: '12 min', level: 'Advanced', icon: 'groups' },
  { title: 'Gamification Psychology', duration: '10 min', level: 'Intermediate', icon: 'insights' },
  { title: 'API Documentation', duration: '20 min', level: 'Expert', icon: 'code' },
  { title: 'Reward System Setup', duration: '8 min', level: 'Beginner', icon: 'redeem' },
]

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-16">
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold mb-6 text-white">
            AndroSky{' '}
            <span className="gradient-text">Academy</span>
          </h1>
          <p className="text-[var(--text-variant)] text-lg md:text-xl max-w-2xl mx-auto font-['Inter'] leading-relaxed">
            Master the art of productivity. Learn tips, tricks, and best practices 
            to get the most out of AndroSky.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="px-6 max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.title} className="glass rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">{resource.icon}</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">{resource.title}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-[var(--text-primary)] font-['JetBrains_Mono']">{resource.duration}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    resource.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    resource.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    resource.level === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{resource.level}</span>
                </div>
                <button className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto text-center mt-20">
          <div className="glass rounded-3xl p-8">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-[var(--text-primary)] mb-6">Our team is ready to help you navigate the cosmos.</p>
            <Link href="/command-center">
              <button className="button-gradient px-8 py-3 rounded-full text-white font-['Space_Grotesk'] font-bold">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}