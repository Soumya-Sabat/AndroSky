'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDocsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    const { data, error } = await supabase
      .from('docs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setDocs(data || []);
    setLoading(false);
  }

  async function deleteDoc(id) {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      const { error } = await supabase.from('docs').delete().eq('id', id);
      if (!error) fetchDocs();
    }
  }

  async function togglePublish(id, currentStatus) {
    await supabase
      .from('docs')
      .update({ is_published: !currentStatus })
      .eq('id', id);
    fetchDocs();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">Documentation Manager</h1>
            <p className="text-[var(--text-primary)] text-sm mt-1">Manage Academy documentation and guides</p>
          </div>
          <Link href="/adminboard/docs/new">
            <button className="button-gradient px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              New Document
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-cyan-400">{docs.length}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Total Documents</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">{docs.filter(d => d.is_published).length}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Published</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-yellow-400">{docs.filter(d => !d.is_published).length}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Drafts</div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">TITLE</th>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">SLUG</th>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">CATEGORY</th>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">STATUS</th>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">VIEWS</th>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">UPDATED</th>
                  <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{doc.title}</div>
                        <div className="text-xs text-[var(--text-primary)]/60 mt-0.5 line-clamp-1">{doc.excerpt}</div>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--text-primary)] font-mono text-xs">{doc.slug}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(doc.id, doc.is_published)}
                        className={`text-xs px-2 py-1 rounded-full transition ${
                          doc.is_published 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {doc.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 text-[var(--text-primary)]">{doc.views || 0}</td>
                    <td className="p-4 text-[var(--text-primary)] text-xs">
                      {new Date(doc.updated_at || doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link href={`/docs/${doc.slug}`} target="_blank" className="text-cyan-400 hover:text-cyan-300">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </Link>
                        <Link href={`/adminboard/docs/edit/${doc.id}`} className="text-yellow-400 hover:text-yellow-300">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </Link>
                        <button onClick={() => deleteDoc(doc.id)} className="text-red-400 hover:text-red-300">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}