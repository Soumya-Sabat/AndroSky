'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDocsPage() {
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
    if (confirm('Delete this document?')) {
      await supabase.from('docs').delete().eq('id', id);
      fetchDocs();
    }
  }

  if (loading) return <div className="p-8 text-cyan-400">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Documentation Manager</h1>
        <Link href="/adminboard/docs/new" className="button-gradient px-4 py-2 rounded-lg text-white">
          + New Document
        </Link>
      </div>
      
      <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td className="p-4 text-white">{doc.title}</td>
                <td className="p-4 text-[var(--text-primary)]">{doc.slug}</td>
                <td className="p-4 text-[var(--text-primary)]">{doc.category}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${doc.is_published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {doc.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/adminboard/docs/edit/${doc.id}`} className="text-cyan-400 hover:text-cyan-300">Edit</Link>
                    <button onClick={() => deleteDoc(doc.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}