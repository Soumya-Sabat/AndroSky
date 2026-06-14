// Create Individual Post Page
import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Generate metadata dynamically
export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  if (!post) return { title: 'Post Not Found' }
  
  return {
    title: `${post.title} | AndroSky`,
    description: post.excerpt,
  }
}

// Generate static paths for all published posts
export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('is_published', true)
  
  return posts?.map((post) => ({ slug: post.slug })) || []
}

async function getPost(slug) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  if (error || !post) return null
  
  // Increment view count
  await supabase
    .from('posts')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', post.id)
  
  return post
}

export default async function SinglePostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) notFound()
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/transmission-hub" className="inline-flex items-center gap-1 text-sm text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors mb-8">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Transmissions
          </Link>
          
          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                post.category_color === 'cyan' ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]' :
                post.category_color === 'purple' ? 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]' :
                'bg-[var(--accent-tertiary)]/20 text-[var(--accent-tertiary)]'
              } font-['JetBrains_Mono']`}>
                {post.category}
              </span>
              <span className="text-sm text-[var(--text-primary)]">{formatDate(post.published_at)}</span>
              <span className="text-sm text-[var(--text-primary)]">• {post.read_time} min read</span>
              <span className="text-sm text-[var(--text-primary)]">• 👁️ {post.views || 0} views</span>
            </div>
            
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
              <span className="material-symbols-outlined text-sm">person</span>
              <span>{post.author || 'AndroSky Team'}</span>
            </div>
          </div>
          
          {/* Featured Image (if exists) */}
          {post.featured_image && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img src={post.featured_image} alt={post.title} className="w-full h-auto" />
            </div>
          )}
          
          {/* Post Content */}
          <div className="glass rounded-3xl p-6 md:p-8 border border-white/10">
            <div 
              className="prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-['Space_Grotesk']
                prose-p:text-[var(--text-primary)] prose-p:font-['Inter'] prose-p:leading-relaxed
                prose-a:text-[var(--accent-cyan)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-[var(--text-primary)]
                prose-li:text-[var(--text-primary)]
                prose-code:text-[var(--accent-cyan)] prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
                prose-pre:bg-[var(--surface-lowest)] prose-pre:border prose-pre:border-white/10"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon...</p>' }}
            />
          </div>
          
          {/* Share Section */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-primary)]">Share this transmission:</span>
              <button className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-sm">share</span>
              </button>
              <button className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-sm">mail</span>
              </button>
            </div>
            
            <Link href="/transmission-hub" className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1">
              Browse All Transmissions →
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}