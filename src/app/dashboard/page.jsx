'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(session);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing session:', error);
      router.push('/login');
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-cyan)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name || 'Commander'}</span>
        </h1>
        <p className="text-[var(--text-primary)] text-sm mt-1">
          Here's your mission overview
        </p>
      </div>

      {/* Stats Row - 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xs text-[var(--text-primary)]/50">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">{user?.total_xp || 0}</div>
          <div className="text-xs text-[var(--text-primary)] mt-1">XP Earned</div>
        </div>

        <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-[var(--text-primary)]/50">Balance</span>
          </div>
          <div className="text-2xl font-bold text-white">{user?.nebula_coins || 100}</div>
          <div className="text-xs text-[var(--text-primary)] mt-1">Nebula Coins</div>
        </div>

        <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🏅</span>
            <span className="text-xs text-[var(--text-primary)]/50">Rank</span>
          </div>
          <div className="text-2xl font-bold text-white">Lv.{user?.current_level || 1}</div>
          <div className="text-xs text-[var(--text-primary)] mt-1">Commander</div>
        </div>

        <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xs text-[var(--text-primary)]/50">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{user?.current_streak || 0}</div>
          <div className="text-xs text-[var(--text-primary)] mt-1">Day Streak</div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-primary)]">Level Progress</span>
          <span className="text-[var(--accent-cyan)] font-['JetBrains_Mono'] text-xs">
            {Math.round(((user?.total_xp || 0) / 2700) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(((user?.total_xp || 0) / 2700) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-primary)]/50 mt-2">
          <span>Nova Seed</span>
          <span>Galaxy Sovereign</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10">
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { title: 'Completed "Design System"', xp: 25, time: '2 hours ago' },
              { title: 'Earned "Early Bird" achievement', xp: 50, time: '5 hours ago' },
              { title: 'Joined "Cosmic Devs" cluster', xp: 10, time: '1 day ago' },
            ].map((item, i) => (
              <div key={i} className="px-5 py-3 flex justify-between items-center">
                <div>
                  <p className="text-white text-sm">{item.title}</p>
                  <p className="text-xs text-[var(--text-primary)]/50">{item.time}</p>
                </div>
                <span className="text-xs text-[var(--accent-cyan)]">+{item.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10">
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-white">Pending Tasks</h2>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { title: 'Complete project documentation', priority: 'High', due: 'Today' },
              { title: 'Review pull requests', priority: 'Medium', due: 'Tomorrow' },
              { title: 'Update user profile', priority: 'Low', due: 'This week' },
            ].map((task, i) => (
              <div key={i} className="px-5 py-3 flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-white text-sm">{task.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{task.priority}</span>
                    <span className="text-[10px] text-[var(--text-primary)]/50">Due: {task.due}</span>
                  </div>
                </div>
                <button className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--accent-cyan)]/20 transition">
                  <span className="material-symbols-outlined text-xs">check</span>
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-2 border-t border-white/10 bg-white/5">
            <button className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition">
              + Add New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}