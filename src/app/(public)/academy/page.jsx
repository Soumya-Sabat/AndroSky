import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Academy - Learn Productivity & Gamification | AndroSky',
  description: 'Master productivity techniques, learn gamification strategies, and get the most out of AndroSky.',
}

const resources = [
  { title: 'Getting Started Guide', duration: '5 min', level: 'Beginner', icon: 'rocket', description: 'Learn the basics of AndroSky and start your productivity journey.' },
  { title: 'Productivity Frameworks', duration: '15 min', level: 'Intermediate', icon: 'psychology', description: 'Master proven frameworks like GTD, Pomodoro, and Eisenhower Matrix.' },
  { title: 'Team Collaboration Best Practices', duration: '12 min', level: 'Advanced', icon: 'groups', description: 'Learn how to effectively collaborate using clusters and shared tasks.' },
  { title: 'Gamification Psychology', duration: '10 min', level: 'Intermediate', icon: 'insights', description: 'Understand the science behind motivation and habit formation.' },
  { title: 'API Documentation', duration: '20 min', level: 'Expert', icon: 'code', description: 'Integrate AndroSky with your existing tools and workflows.' },
  { title: 'Reward System Setup', duration: '8 min', level: 'Beginner', icon: 'redeem', description: 'Set up and optimize your reward system for maximum motivation.' },
]

export default function AcademyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-16">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
            <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-cyan)] uppercase tracking-[0.2em]">Knowledge Base</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold mb-6 text-white">
            AndroSky{' '}
            <span className="gradient-text">Academy</span>
          </h1>
          <p className="text-[var(--text-variant)] text-lg md:text-xl max-w-2xl mx-auto font-['Inter'] leading-relaxed">
            Master the art of productivity. Learn tips, tricks, and best practices 
            to get the most out of AndroSky.
          </p>
        </div>

        {/* Search Bar */}
        <div className="px-6 max-w-2xl mx-auto mb-12">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search tutorials, guides, and resources..."
              className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)] border border-white/10"
            />
          </div>
        </div>

        {/* Resource Cards */}
        <div className="px-6 max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.title} className="glass rounded-2xl p-6 card-hover transition-all duration-300 hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">{resource.icon}</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-[var(--text-primary)] text-sm font-['Inter'] mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-[var(--text-primary)] font-['JetBrains_Mono']">{resource.duration}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    resource.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    resource.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    resource.level === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{resource.level}</span>
                </div>
                <button className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1 group">
                  Learn More 
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-[var(--surface-low)]/40 py-16 mb-12">
          <div className="px-6 max-w-7xl mx-auto">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white text-center mb-10">
              Browse by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['All', 'Beginner', 'Intermediate', 'Advanced', 'Productivity', 'Collaboration', 'Gamification', 'API'].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-['Inter'] bg-white/5 text-[var(--text-primary)] hover:bg-[var(--accent-cyan)]/20 hover:text-white transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="px-6 max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--text-primary)] text-sm">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-3">
            {[
              { q: 'Is AndroSky free?', a: 'Yes! The free tier includes unlimited personal tasks and basic features.' },
              { q: 'How do clusters work?', a: 'Clusters are private groups with unique codes. Only people with the code can join.' },
              { q: 'Can I switch between Personal and Professional?', a: 'Absolutely! One-click toggle lets you separate work and life tasks.' },
              { q: 'What happens to my data?', a: 'Your data is encrypted and private. We never share or sell your information.' },
            ].map((faq) => (
              <div key={faq.q} className="glass rounded-xl p-5 transition-all hover:bg-white/5">
                <details className="group">
                  <summary className="font-['Space_Grotesk'] font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-[var(--text-primary)] group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-[var(--text-primary)] text-sm font-['Inter'] mt-3 pl-0">{faq.a}</p>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)]/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-purple)]/10 rounded-full blur-2xl"></div>
            
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">Still Have Questions?</h3>
            <p className="text-[var(--text-primary)] mb-6">Our team is ready to help you navigate the cosmos.</p>
            <Link href="/command-center">
              <button className="button-gradient px-8 py-3 rounded-full text-white font-['Space_Grotesk'] font-bold transition-all hover:scale-[1.02]">
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