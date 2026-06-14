// export const metadata = {
//   title: 'Galaxy Map - Your Productivity Journey | AndroSky',
//   description: 'Visualize your progress through 20 levels of productivity mastery. From Nova Seed to Galaxy Sovereign.',
// }
'use client'

import { useEffect, useState, useRef } from 'react'
import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'


const levels = [
  { level: 1, title: 'Nova Seed', xp: 0, feature: 'Basic Tasks', icon: '🌱', color: '#06B6D4' },
  { level: 2, title: 'Dust Collector', xp: 100, feature: '—', icon: '✨', color: '#4C9AFF' },
  { level: 3, title: 'Ember', xp: 283, feature: 'Custom Themes', icon: '🔥', color: '#F97316' },
  { level: 4, title: 'Star Kindler', xp: 520, feature: 'Smart Reminders', icon: '⭐', color: '#FFD700' },
  { level: 5, title: 'Comet Rider', xp: 800, feature: 'Habits Tracker', icon: '☄️', color: '#EC4899' },
  { level: 6, title: 'Moon Walker', xp: 1118, feature: 'Join Clusters', icon: '🌙', color: '#8B5CF6' },
  { level: 7, title: 'Ring Bearer', xp: 1470, feature: 'Achievements', icon: '🪐', color: '#C084FC' },
  { level: 8, title: 'Pulsar', xp: 1852, feature: 'Task Templates', icon: '⚡', color: '#22C55E' },
  { level: 9, title: 'Nebula Lord', xp: 2263, feature: 'Create Clusters', icon: '🌌', color: '#A855F7' },
  { level: 10, title: 'Galaxy Sovereign', xp: 2700, feature: 'Advanced Analytics', icon: '👑', color: '#FBBF24' },
]

const collections = [
    { level: 1, title: 'Basic Tasks', desc: 'Create and manage your daily missions', icon: '📋', glow: 'cyan' },
    { level: 3, title: 'Custom Themes', desc: 'Personalize your nebula experience', icon: '🎨', glow: 'purple' },
    { level: 5, title: 'Habits Tracker', desc: 'Build and maintain daily routines', icon: '🔥', glow: 'orange' },
    { level: 6, title: 'Join Clusters', desc: 'Collaborate with teams using secret codes', icon: '👥', glow: 'cyan' },
    { level: 7, title: 'Achievements', desc: 'Earn badges and cosmic recognition', icon: '🏆', glow: 'purple' },
    { level: 8, title: 'Task Templates', desc: 'Save time with reusable templates', icon: '📝', glow: 'cyan' },
    { level: 9, title: 'Create Clusters', desc: 'Form your own private constellations', icon: '🚀', glow: 'purple' },
    { level: 10, title: 'Analytics', desc: 'Deep insights into your productivity', icon: '📊', glow: 'cyan' },
    { level: 15, title: 'Goal Tracking', desc: 'Set and track long-term objectives', icon: '🎯', glow: 'purple' },
  ]

// Star component for background
const Star = ({ delay, top, left, size }) => (
  <div
    className="absolute bg-white rounded-full animate-twinkle"
    style={{
      width: size,
      height: size,
      top: top,
      left: left,
      animationDelay: delay,
      opacity: 0.5,
    }}
  />
)

export default function GalaxyMapPage() {
  const [scrollY, setScrollY] = useState(0)
  const [hoveredLevel, setHoveredLevel] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      
      <main className="pt-32 pb-20 relative">
        {/* Animated Background Stars */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <Star
              key={i}
              delay={`${Math.random() * 5}s`}
              top={`${Math.random() * 100}%`}
              left={`${Math.random() * 100}%`}
              size={`${Math.random() * 2 + 1}px`}
            />
          ))}
        </div>

        {/* Constellation Timeline - Better than list view */}
        <div className="bg-[var(--surface-low)]/40">
          <div className="px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="gradient-text">Constellation Map</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] mx-auto rounded-full"></div>
              <p className="text-[var(--text-primary)] mt-4">Your path to becoming a Galaxy Sovereign</p>
            </div>

            {/* Constellation Connection View */}
            <div className="relative max-w-5xl mx-auto">
              {levels.map((level, idx) => (
                <div key={level.level} className="flex items-center gap-6 mb-8 group">
                  {/* Connection line */}
                  {idx < levels.length - 1 && (
                    <div className="absolute left-[27px] top-[60px] w-0.5 h-16 bg-gradient-to-b from-[var(--accent-cyan)] to-[var(--accent-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ transform: `translateY(${idx * 76}px)` }} />
                  )}
                  
                  {/* Icon Circle */}
                  <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-300 group-hover:scale-110 ${
                    idx < 4 
                      ? `from-[${level.color}]/30 to-[${level.color}]/10 border-2 border-[${level.color}] shadow-lg shadow-[${level.color}]/20` 
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <span className="text-2xl">{level.icon}</span>
                    {idx < 4 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-white">check</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 glass rounded-2xl p-5 group-hover:border-[var(--accent-cyan)]/30 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">{level.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-[var(--text-primary)] font-['JetBrains_Mono']">
                            Level {level.level}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-primary)]">{level.xp.toLocaleString()} XP required</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {level.feature !== '—' && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="material-symbols-outlined text-sm text-[var(--accent-cyan)]">lock_open</span>
                            <span className="text-[var(--text-primary)]">{level.feature}</span>
                          </div>
                        )}
                        
                        {idx < 4 ? (
                          <div className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-['JetBrains_Mono']">
                            ✓ Achieved
                          </div>
                        ) : (
                          <div className="px-4 py-1.5 rounded-full bg-white/10 text-[var(--text-primary)] text-xs font-['JetBrains_Mono']">
                            🔒 Locked
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Mini progress bar for next level */}
                    {idx === 4 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-primary)]">Progress</span>
                          <span className="text-[var(--accent-cyan)]">680/800 XP</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[85%] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Unlock Section - Galaxy Card Style */}
        <div className="py-20">
          <div className="px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white mb-4">
                ✨ Unlockable Powers ✨
              </h2>
              <p className="text-[var(--text-primary)]">Each level brings new abilities to master the cosmos</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((feature, idx) => (
                <div
                  key={feature.title}
                  className="group glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-${feature.glow})]/20 to-transparent flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-['JetBrains_Mono'] text-[var(--accent-cyan)] mb-2">
                    Level {feature.level}
                  </div>
                  <h4 className="font-['Space_Grotesk'] font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-[var(--text-primary)] text-sm font-['Inter']">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Epic CTA */}
        <div className="px-6 max-w-4xl mx-auto text-center mt-12 mb-20">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-purple)]/20 blur-3xl"></div>
            <div className="relative glass rounded-3xl p-12 border border-white/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)]/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--accent-purple)]/10 rounded-full blur-2xl"></div>
              
              <h3 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Explore the Galaxy?
              </h3>
              <p className="text-[var(--text-primary)] text-lg mb-8 max-w-xl mx-auto">
                Start your journey today. Every task brings you closer to the stars.
              </p>
              <Link 
              href="/register"
              className="button-gradient px-8 py-4 rounded-full text-white font-['Space_Grotesk'] font-bold text-lg uppercase tracking-wider group">
                Begin Your Odyssey
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}