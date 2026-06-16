'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EditDocPage() {
  const router = useRouter();
  const params = useParams();
  const docId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Getting Started',
    author: 'AndroSky Team',
    read_time: 5,
    tags: [],
    is_published: true
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'Getting Started',
    'Productivity',
    'Collaboration',
    'Gamification',
    'API',
    'Rewards',
    'Analytics',
    'Security',
    'Troubleshooting'
  ];

  useEffect(() => {
    if (docId) fetchDoc();
  }, [docId]);

  async function fetchDoc() {
    try {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('id', docId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || 'Getting Started',
          author: data.author || 'AndroSky Team',
          read_time: data.read_time || 5,
          tags: data.tags || [],
          is_published: data.is_published ?? true
        });
      }
    } catch (error) {
      console.error('Error fetching doc:', error);
      alert('Failed to load document data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('docs')
        .update({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          read_time: parseInt(formData.read_time) || 5,
          tags: formData.tags,
          is_published: formData.is_published,
          updated_at: new Date().toISOString()
        })
        .eq('id', docId);

      if (error) throw error;

      alert('Changes saved successfully!');
      router.push('/adminboard/docs');
      router.refresh();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">Edit Document</h1>
            <p className="text-[var(--text-primary)] text-sm mt-1">Update documentation content</p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Document Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-lg focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Short Description / Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Content (HTML)</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="15"
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Read Time (minutes)</label>
                    <input type="number" name="read_time" value={formData.read_time} onChange={handleChange} min="1" className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-white ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-['JetBrains_Mono'] text-cyan-400">Published</span>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 bg-[var(--surface-low)] text-cyan-400"
                  />
                </label>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-3 button-gradient rounded-xl text-white font-semibold disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}