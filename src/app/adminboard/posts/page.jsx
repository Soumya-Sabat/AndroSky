'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  }

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-['Space_Grotesk']">Blog Manager</h1>
        <Link href="/adminboard/posts/new" className="bg-purple-600 px-4 py-2 rounded-lg text-sm font-bold">+ New Post</Link>
      </div>
      
      <div className="bg-[#131315] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-black/20 text-gray-400 uppercase text-[10px]">
            <tr><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="p-4 font-medium">{post.title}</td>
                <td className="p-4 text-cyan-400">{post.category}</td>
                <td className="p-4">{post.is_published ? 'Published' : 'Draft'}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}