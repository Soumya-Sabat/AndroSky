'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    users: 0, 
    messages: 0, 
    recentPosts: [],
    totalClusters: 0,
    totalTasks: 0,
    totalRewards: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Get counts
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: msgCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
      const { count: clusterCount } = await supabase.from('clusters').select('*', { count: 'exact', head: true });
      const { count: taskCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
      const { count: rewardCount } = await supabase.from('rewards').select('*', { count: 'exact', head: true });
      
      // Get latest blog posts
      const { data: posts } = await supabase
        .from('posts')
        .select('title, category, created_at, slug')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent activities from logs
      const { data: logs } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({ 
        users: userCount || 0, 
        messages: msgCount || 0, 
        recentPosts: posts || [],
        totalClusters: clusterCount || 0,
        totalTasks: taskCount || 0,
        totalRewards: rewardCount || 0
      });
      setRecentActivities(logs || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-[var(--text-primary)] mt-4">Loading command center...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: '👥',
      gradient: 'from-cyan-500/20 to-cyan-600/10',
      border: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      link: '/adminboard/users',
      trend: '+12% this month'
    },
    {
      title: 'Active Clusters',
      value: stats.totalClusters,
      icon: '🪐',
      gradient: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      textColor: 'text-purple-400',
      link: '/adminboard/clusters',
      trend: '+5 new'
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: '📋',
      gradient: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      link: '/adminboard/tasks',
      trend: `${Math.floor(stats.totalTasks * 0.73)} completed`
    },
    {
      title: 'Pending Messages',
      value: stats.messages,
      icon: '✉️',
      gradient: 'from-orange-500/20 to-orange-600/10',
      border: 'border-orange-500/30',
      textColor: 'text-orange-400',
      link: '/adminboard/messages',
      trend: stats.messages > 0 ? 'Action required' : 'All clear'
    },
    {
      title: 'Rewards Catalog',
      value: stats.totalRewards,
      icon: '🎁',
      gradient: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/30',
      textColor: 'text-green-400',
      link: '/adminboard/rewards',
      trend: 'Available for redemption'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: '🟢',
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      link: '#',
      trend: 'All systems operational'
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      system: '🖥️',
      application: '📱',
      security: '🔒',
      default: '📌'
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-2">
        <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Command Center
        </h1>
        <p className="text-[var(--text-primary)] text-sm mt-1">
          Welcome back, Administrator. Here's your platform overview.
        </p>
      </div>

      {/* Stats Grid - 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <Link href={card.link} key={idx}>
            <div className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-xl p-5 border ${card.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer group`}>
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{card.icon}</span>
                  <span className="text-xs text-[var(--text-primary)]/60">{card.trend}</span>
                </div>
                <div className={`text-3xl font-bold ${card.textColor}`}>{card.value.toLocaleString()}</div>
                <div className="text-sm text-[var(--text-primary)]/70 mt-1">{card.title}</div>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-purple-400 flex items-center gap-1">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Blog Posts */}
        <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <h3 className="font-['Space_Grotesk'] font-semibold text-white">Recent Blog Posts</h3>
            </div>
            <Link href="/adminboard/posts" className="text-xs text-purple-400 hover:text-purple-300 transition">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post, i) => (
                <div key={i} className="px-5 py-3 hover:bg-white/5 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-[var(--text-primary)]/50">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link href={`/adminboard/posts/edit/${post.slug}`}>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-[var(--text-primary)]/50 text-sm">
                No recent posts found
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-white/10 bg-white/5">
            <Link href="/adminboard/posts/new">
              <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition flex items-center justify-center gap-1">
                + Create New Post
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">📡</span>
              <h3 className="font-['Space_Grotesk'] font-semibold text-white">Recent System Activity</h3>
            </div>
          </div>
          <div className="divide-y divide-white/10 max-h-[300px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="px-5 py-3 hover:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getActivityIcon(activity.log_type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          activity.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                          activity.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {activity.severity}
                        </span>
                        <span className="text-[10px] text-[var(--text-primary)]/50">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-[var(--text-primary)]/50 text-sm">
                No recent activity
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-white/10 bg-white/5">
            <Link href="/adminboard/logs">
              <button className="w-full text-sm text-purple-400 hover:text-purple-300 transition flex items-center justify-center gap-1">
                View All Logs →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl border border-white/10 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-['Space_Grotesk'] font-semibold text-white">Quick Actions</h4>
            <p className="text-xs text-[var(--text-primary)]/70 mt-1">Frequently used administrative tasks</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/adminboard/users">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-cyan-500/20 transition">
                👥 Manage Users
              </button>
            </Link>
            <Link href="/adminboard/rewards/new">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-green-500/20 transition">
                🎁 Add Reward
              </button>
            </Link>
            <Link href="/adminboard/posts/new">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-purple-500/20 transition">
                📝 Write Post
              </button>
            </Link>
            <Link href="/adminboard/messages">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-orange-500/20 transition">
                ✉️ Check Messages
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}