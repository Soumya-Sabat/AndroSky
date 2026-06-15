'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/landing/Navbar';
import Footer from '@/component/landing/Footer';
import Link from 'next/link';

export default function DocPage({ params }) {
  // Unwrap params Promise using React.use()
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoc();
  }, [slug]);

  async function fetchDoc() {
    try {
      const response = await fetch(`/api/docs/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setDoc(data.doc);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error fetching doc:', error);
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-5xl mb-4 block">📄</span>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-2">Document Not Found</h1>
            <p className="text-[var(--text-primary)] mb-6">{error || 'The requested documentation could not be found.'}</p>
            <Link href="/academy">
              <button className="button-gradient px-6 py-2 rounded-lg text-white">
                Back to Academy
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors mb-8 group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Academy
          </button>

          {/* Doc Content */}
          <div className="glass rounded-3xl p-8 md:p-10">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-white/10">
              <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white mb-4">
                {doc.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-primary)]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">person</span>
                  {doc.author}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {doc.read_time} min read
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  {doc.views || 0} views
                </span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-['Space_Grotesk'] prose-headings:mt-8 prose-headings:mb-4
                prose-h2:text-2xl prose-h2:font-bold
                prose-h3:text-xl prose-h3:font-semibold
                prose-p:text-[var(--text-primary)] prose-p:font-['Inter'] prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-[var(--text-primary)] prose-ul:pl-6 prose-ul:mb-4
                prose-ol:text-[var(--text-primary)] prose-ol:pl-6 prose-ol:mb-4
                prose-li:text-[var(--text-primary)] prose-li:mb-1
                prose-a:text-[var(--accent-cyan)] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-[var(--accent-cyan)] prose-code:bg-white/5 prose-code:px-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-[var(--surface-lowest)] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
                prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent-cyan)] prose-blockquote:pl-4 prose-blockquote:text-[var(--text-primary)] prose-blockquote:italic
                prose-table:border-collapse prose-table:w-full
                prose-th:border prose-th:border-white/10 prose-th:p-2 prose-th:text-white
                prose-td:border prose-td:border-white/10 prose-td:p-2
              "
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />

            {/* Navigation Footer */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-4">
              <button
                onClick={() => router.back()}
                className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Academy
              </button>
              <Link href="/academy">
                <button className="text-sm text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors flex items-center gap-1">
                  Browse All Resources
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}