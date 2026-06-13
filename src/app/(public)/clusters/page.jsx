import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Clusters - Collaborative Task Groups | AndroSky',
  description: 'Create private clusters for team collaboration. Share tasks, track progress together, and earn team rewards.',
}

export default function ClustersPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center px-6 max-w-4xl mx-auto mb-20">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-purple)]/30 bg-[var(--accent-purple)]/10 backdrop-blur-sm">
            <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-purple)] uppercase tracking-[0.2em]">Team Collaboration</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold mb-6 text-white">
            Work Together in{' '}
            <span className="gradient-text">Private Clusters</span>
          </h1>
          <p className="text-[var(--text-variant)] text-lg md:text-xl max-w-2xl mx-auto font-['Inter'] leading-relaxed">
            Create passwordless private groups with unique codes. Share tasks, track progress, 
            and earn team rewards—all in complete privacy.
          </p>
        </div>

        {/* Features */}
        <div className="px-6 max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-8 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">lock</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Code-Locked Privacy</h3>
              </div>
              <p className="text-[var(--text-primary)] font-['Inter'] leading-relaxed">
                Every cluster is protected by a unique 5-character alphanumeric code. 
                No public directory. No search. Only those with the code can join.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple)]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-[var(--accent-purple)]">groups</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Real-Time Sync</h3>
              </div>
              <p className="text-[var(--text-primary)] font-['Inter'] leading-relaxed">
                See when teammates complete tasks. Get instant notifications. 
                Everything syncs across all members in real-time.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-tertiary)]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-[var(--accent-tertiary)]">military_tech</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Team Leaderboards</h3>
              </div>
              <p className="text-[var(--text-primary)] font-['Inter'] leading-relaxed">
                Track individual and team contributions. Friendly competition drives productivity.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">refresh</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Code Regeneration</h3>
              </div>
              <p className="text-[var(--text-primary)] font-['Inter'] leading-relaxed">
                Admins can regenerate cluster codes at any time, instantly invalidating the old one for security.
              </p>
            </div>
          </div>
        </div>

        {/* How Clusters Work */}
        <div className="bg-[var(--surface-low)]/40 py-20 mb-20">
          <div className="px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-4">How Clusters Work</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-cyan)]/20 flex items-center justify-center mb-4">
                  <span className="text-[var(--accent-cyan)] font-['JetBrains_Mono'] font-bold">1</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">Create a Cluster</h4>
                <p className="text-[var(--text-primary)] text-sm font-['Inter']">Name your cluster and get a unique 5-character code like "X7K92".</p>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)]/20 flex items-center justify-center mb-4">
                  <span className="text-[var(--accent-purple)] font-['JetBrains_Mono'] font-bold">2</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">Share the Code</h4>
                <p className="text-[var(--text-primary)] text-sm font-['Inter']">Share the code privately with your team members.</p>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-tertiary)]/20 flex items-center justify-center mb-4">
                  <span className="text-[var(--accent-tertiary)] font-['JetBrains_Mono'] font-bold">3</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">Members Join</h4>
                <p className="text-[var(--text-primary)] text-sm font-['Inter']">Team members enter the code to join your private cluster.</p>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-cyan)]/20 flex items-center justify-center mb-4">
                  <span className="text-[var(--accent-cyan)] font-['JetBrains_Mono'] font-bold">4</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">Collaborate</h4>
                <p className="text-[var(--text-primary)] text-sm font-['Inter']">Assign tasks, track progress, and earn team XP together.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-8">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-3">Ready to Collaborate?</h3>
            <p className="text-[var(--text-primary)] mb-6">Create your first cluster and invite your team.</p>
            <Link 
            href="/#"
            className="button-gradient px-8 py-3 rounded-full text-white font-['Space_Grotesk'] font-bold">
              Start a Cluster
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}