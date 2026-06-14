'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, messages: 0, recentPosts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Get counts
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: msgCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
      
      // 2. Get 5 latest blog posts
      const { data: posts } = await supabase
        .from('posts')
        .select('title, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({ users: userCount || 0, messages: msgCount || 0, recentPosts: posts || [] });
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-cyan-400 font-mono">INITIALIZING ADMIN MATRIX...</div>;

  return (
    <div className="text-white space-y-8">
      <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-[#dae2fd]">Mission Control</h1>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#131315] border border-white/10 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Total Users</p>
          <h2 className="text-4xl font-bold mt-2 text-cyan-400">{stats.users}</h2>
        </div>
        <div className="p-6 bg-[#131315] border border-white/10 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Pending Inquiries</p>
          <h2 className="text-4xl font-bold mt-2 text-purple-400">{stats.messages}</h2>
        </div>
        <div className="p-6 bg-[#131315] border border-white/10 rounded-2xl">
          <p className="text-gray-500 text-xs uppercase tracking-widest">System Health</p>
          <div className="flex items-center mt-3 gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-500 text-sm font-bold">OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Blog Management Preview */}
        <div className="bg-[#131315] border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Recent Blog Activity</h3>
            <Link href="/adminboard/posts" className="text-[10px] uppercase text-purple-400 hover:text-purple-300">View All</Link>
          </div>
          <div className="space-y-4">
            {stats.recentPosts.length > 0 ? stats.recentPosts.map((p, i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-[10px] text-gray-500">{p.category}</p>
                </div>
              </div>
            )) : <p className="text-gray-600 text-sm">No recent posts found.</p>}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#131315] border border-white/10 p-6 rounded-2xl flex flex-col justify-center gap-4">
          <h3 className="font-bold">Quick Administrative Tools</h3>
          <Link href="/adminboard/posts/new" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-purple-500/50 transition">
            Create Blog Post →
          </Link>
          <Link href="/adminboard/posts" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-purple-500/50 transition">
            Read Blog Post →
          </Link>
          <Link href="/adminboard/messages" className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-purple-500/50 transition">
            Review Inquiries ({stats.messages}) →
          </Link>
        </div>
      </div>
    </div>
  );
}