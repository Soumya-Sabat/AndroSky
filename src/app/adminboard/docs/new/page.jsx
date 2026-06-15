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
    
    // Auto-generate slug from title
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
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          read_time: parseInt(formData.read_time),
          tags: formData.tags,
          is_published: formData.is_published
        }]);

      if (error) throw error;

      router.push('/adminboard/docs');
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick insert helpers for content
  const insertHeading = () => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n<h2>New Heading</h2>\n'
    }));
  };

  const insertParagraph = () => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n<p>New paragraph text here...</p>\n'
    }));
  };

  const insertCode = () => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n<pre><code>// Your code here\nconsole.log("Hello World");</code></pre>\n'
    }));
  };

  const insertList = () => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>\n'
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">Create New Document</h1>
            <p className="text-[var(--text-primary)] text-sm mt-1">Add documentation to the Academy</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
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

              {/* Excerpt */}
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

              {/* Content Editor */}
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-['JetBrains_Mono'] text-cyan-400">Content (HTML)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={insertHeading}
                      className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition"
                    >
                      Heading
                    </button>
                    <button
                      type="button"
                      onClick={insertParagraph}
                      className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition"
                    >
                      Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={insertCode}
                      className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition"
                    >
                      Code Block
                    </button>
                    <button
                      type="button"
                      onClick={insertList}
                      className="px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20 transition"
                    >
                      List
                    </button>
                  </div>
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="15"
                  placeholder="<h2>Section Title</h2>
<p>Your content here...</p>
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>"
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  required
                />
                <p className="text-xs text-[var(--text-primary)]/50 mt-2">
                  Supports HTML tags: h2, h3, p, ul, ol, li, pre, code, blockquote, a, strong, em
                </p>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Slug */}
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="getting-started-guide"
                  className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  required
                />
                <p className="text-xs text-[var(--text-primary)]/50 mt-2">
                  Used in URL: /docs/{formData.slug || 'your-slug'}
                </p>
              </div>

              {/* Category */}
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

              {/* Author & Read Time */}
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Read Time (minutes)</label>
                    <input
                      type="number"
                      name="read_time"
                      value={formData.read_time}
                      onChange={handleChange}
                      min="1"
                      max="60"
                      className="w-full px-4 py-3 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-xs text-[var(--text-primary)]/50">No tags added</p>
                  )}
                </div>
              </div>

              {/* Publish Status */}
              <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-['JetBrains_Mono'] text-cyan-400">Publish Immediately</span>
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 bg-[var(--surface-low)] text-cyan-400 focus:ring-cyan-400"
                  />
                </label>
                <p className="text-xs text-[var(--text-primary)]/50 mt-2">
                  {formData.is_published 
                    ? 'Document will be visible to all users immediately.' 
                    : 'Document will be saved as draft and not visible to users.'}
                </p>
              </div>

              {/* Preview Link */}
              {formData.slug && (
                <div className="bg-[var(--surface)]/60 rounded-xl p-6 border border-white/10">
                  <label className="block text-sm font-['JetBrains_Mono'] text-cyan-400 mb-2">Preview URL</label>
                  <div className="text-sm text-[var(--accent-cyan)] break-all">
                    /docs/{formData.slug}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 button-gradient rounded-xl text-white font-semibold disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Document'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}