'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewPost() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: 'General' });


const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add { returning: 'minimal' } to prevent the secondary SELECT check
    const { error } = await supabase
      .from('posts')
      .insert([form], { returning: 'minimal' }); 

    if (error) {
      console.error("Insert Error Details:", error);
      alert("Error: " + error.message);
    } else {
      alert("Post Published!");
      router.push('/adminboard/posts');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#131315] p-8 rounded-2xl border border-white/10">
        <input placeholder="Post Title" className="w-full bg-black/40 p-3 rounded border border-white/10" onChange={(e) => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
        <input placeholder="Category" className="w-full bg-black/40 p-3 rounded border border-white/10" onChange={(e) => setForm({...form, category: e.target.value})} />
        <textarea placeholder="Excerpt" className="w-full bg-black/40 p-3 rounded border border-white/10" onChange={(e) => setForm({...form, excerpt: e.target.value})} />
        <textarea placeholder="Full Content" className="w-full h-64 bg-black/40 p-3 rounded border border-white/10" onChange={(e) => setForm({...form, content: e.target.value})} />
        <button type="submit" className="w-full bg-purple-600 py-3 rounded-lg font-bold">Publish to Blog</button>
      </form>
    </div>
  );
}