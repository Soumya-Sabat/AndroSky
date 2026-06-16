'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewDocPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
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
    setLoading(true);

    try {
      const { error } = await supabase
        .from('docs')
        .insert([{
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          read_time: parseInt(formData.read_time) || 5,
          tags: formData.tags,
          is_published: formData.is_published
        }]);

      if (error) throw error;

      alert('Document created successfully!');
      router.push('/adminboard/docs');
      router.refresh();
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const insertHelper = (markup) => {
    setFormData(prev => ({ ...prev, content: prev.content + markup }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">Create New Document</h1>
            <p className="text-[var(--text-primary)] text-sm mt-1">Add documentation to the Academy</p>
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
                  placeholder="e.g., Getting Started Guide"
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
                  placeholder="A brief summary of this document..."
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-['JetBrains_Mono'] text-cyan-400">Content (HTML)</label>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => insertHelper('\n<h2>Heading</h2>\n')} className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20">Heading</button>
                    <button type="button" onClick={() => insertHelper('\n<p>Paragraph text...</p>\n')} className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20">Paragraph</button>
                    <button type="button" onClick={() => insertHelper('\n<pre><code>// code here</code></pre>\n')} className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20">Code Block</button>
                    <button type="button" onClick={() => insertHelper('\n<ul>\n <li>Item 1</li>\n</ul>\n')} className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20">List</button>
                  </div>
                </div>
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
                    <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Read Time (mins)</label>
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
                    placeholder="Add tag..."
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
                  <span className="text-sm font-['JetBrains_Mono'] text-cyan-400">Publish Immediately</span>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 bg-[var(--surface-low)] text-cyan-400"
                  />
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 button-gradient rounded-xl text-white font-semibold disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Document'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}