'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/component/landing/Navbar';
import Footer from '@/component/landing/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Available tags for category filtering
const allTags = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Productivity', 'Collaboration', 'Gamification', 'API', 'Rewards', 'Analytics'];

export default function AcademyPage() {
  const router = useRouter();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      const response = await fetch('/api/docs');
      const data = await response.json();
      if (data.success) {
        setResources(data.docs);
      }
    } catch (error) {
      console.error('Error fetching docs:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter resources based on search and tag
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
                          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || (resource.tags && resource.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  // Display only first 6 posts in grid (rest in scrollable container)
  const displayedResources = filteredResources.slice(0, 6);
  const extraResources = filteredResources.slice(6);

  const handleLearnMore = (slug) => {
    router.push(`/docs/${slug}`);
  };

  const getLevelFromTags = (tags) => {
    if (tags?.includes('Beginner')) return 'Beginner';
    if (tags?.includes('Intermediate')) return 'Intermediate';
    if (tags?.includes('Advanced')) return 'Advanced';
    if (tags?.includes('Expert')) return 'Expert';
    return 'Intermediate';
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-orange-500/20 text-orange-400';
      case 'Expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </main>
        <Footer />
      </div>
    );
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)] border border-white/10"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-[var(--text-primary)]/60 mt-2 text-center">
              Found {filteredResources.length} result(s)
            </p>
          )}
        </div>

        {/* Categories Section with Tags */}
        <div className="bg-[var(--surface-low)]/40 py-8 mb-8">
          <div className="px-6 max-w-7xl mx-auto">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Browse by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-['Inter'] transition-all ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] text-white shadow-lg'
                      : 'bg-white/5 text-[var(--text-primary)] hover:bg-[var(--accent-cyan)]/20 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Cards - Main Grid (First 6) */}
        <div className="px-6 max-w-7xl mx-auto mb-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-3 block">🔍</span>
              <h3 className="text-white font-medium mb-2">No results found</h3>
              <p className="text-[var(--text-primary)] text-sm">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedResources.map((resource) => {
                  const level = getLevelFromTags(resource.tags);
                  return (
                    <div key={resource.slug} className="glass rounded-2xl p-6 card-hover transition-all duration-300 hover:scale-[1.02]">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">description</span>
                      </div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">{resource.title}</h3>
                      <p className="text-[var(--text-primary)] text-sm font-['Inter'] mb-3 line-clamp-2">
                        {resource.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-xs text-[var(--text-primary)] font-['JetBrains_Mono']">{resource.read_time} min</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getLevelColor(level)}`}>{level}</span>
                      </div>
                      {/* Tags */}
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--text-primary)]/70">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <button 
                        onClick={() => handleLearnMore(resource.slug)}
                        className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1 group"
                      >
                        Learn More 
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Extra Resources - Scrollable Container */}
              {extraResources.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-4">More Resources</h3>
                  <div className="overflow-x-auto scrollbar-hidden">
                    <div className="flex gap-5 pb-4">
                      {extraResources.map((resource) => {
                        const level = getLevelFromTags(resource.tags);
                        return (
                          <div key={resource.slug} className="glass rounded-2xl p-5 min-w-[280px] md:min-w-[320px] transition-all duration-300 hover:scale-[1.02] hover:border-[var(--accent-cyan)]/30">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                              <span className="material-symbols-outlined text-xl text-[var(--accent-cyan)]">description</span>
                            </div>
                            <h3 className="font-['Space_Grotesk'] text-base font-bold text-white mb-1">{resource.title}</h3>
                            <p className="text-[var(--text-primary)] text-xs font-['Inter'] mb-2 line-clamp-2">
                              {resource.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-[10px] text-[var(--text-primary)] font-['JetBrains_Mono']">{resource.read_time} min</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${getLevelColor(level)}`}>{level}</span>
                            </div>
                            <button 
                              onClick={() => handleLearnMore(resource.slug)}
                              className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1 group"
                            >
                              Learn More 
                              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
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
              { q: 'Can I switch between Private and Public?', a: 'Absolutely! One-click toggle lets you separate work and life tasks.' },
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
  );
}