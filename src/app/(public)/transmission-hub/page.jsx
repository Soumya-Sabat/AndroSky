import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Transmission Hub - News & Updates | NebulaTasks',
  description: 'Latest news, product updates, and announcements from the NebulaTasks team.',
}

// This is a Server Component - data fetched at build time
async function getPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, category_color, read_time, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  
  return posts
}

export default async function TransmissionHubPage() {
  const posts = await getPosts()
  
  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
              <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-cyan)] uppercase tracking-[0.2em]">Latest Transmissions</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold mb-4 text-white">
              Transmission <span className="gradient-text">Hub</span>
            </h1>
            <p className="text-[var(--text-variant)] text-lg max-w-2xl mx-auto font-['Inter']">
              News, updates, and insights from the NebulaTasks team.
            </p>
          </div>

          {/* Subscribe Banner */}
          <div className="glass rounded-2xl p-6 mb-12 text-center border border-white/10">
            <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">mail</span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mt-2">Subscribe to Updates</h3>
            <p className="text-sm text-[var(--text-primary)] mb-4">Get the latest transmissions delivered to your inbox.</p>
            <div className="flex max-w-md mx-auto gap-3">
              <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-lg text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)]" />
              <button className="button-gradient px-4 py-2 rounded-lg text-white text-sm">Subscribe</button>
            </div>
          </div>

          {/* Posts - Dynamically from Database */}
          {posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-[var(--text-primary)]">inbox</span>
              <p className="text-[var(--text-primary)] mt-4">No transmissions yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="glass rounded-2xl p-6 card-hover border border-white/5 hover:border-[var(--accent-cyan)]/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      post.category_color === 'cyan' ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]' :
                      post.category_color === 'purple' ? 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]' :
                      'bg-[var(--accent-tertiary)]/20 text-[var(--accent-tertiary)]'
                    } font-['JetBrains_Mono']`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-[var(--text-primary)]">{formatDate(post.published_at)}</span>
                    <span className="text-xs text-[var(--text-primary)]">• {post.read_time} min read</span>
                  </div>
                  
                  <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2 hover:text-[var(--accent-cyan)] transition-colors">
                    <Link href={`/transmission-hub/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-[var(--text-primary)] font-['Inter'] text-sm mb-4">{post.excerpt}</p>
                  
                  <Link href={`/transmission-hub/${post.slug}`} className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1">
                    Read Transmission →
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Pagination - To be implemented */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button className="px-4 py-2 glass rounded-lg text-[var(--text-primary)] hover:text-white disabled:opacity-50" disabled>Previous</button>
            <span className="text-sm text-white">Page 1 of 1</span>
            <button className="px-4 py-2 glass rounded-lg text-[var(--text-primary)] hover:text-white disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </main>
      
      <Footer/>
    </div>
  )
}