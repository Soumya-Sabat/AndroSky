'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all
  const [analytics, setAnalytics] = useState({
    users: { total: 0, new: 0, active: 0, growth: 0 },
    tasks: { total: 0, completed: 0, completionRate: 0, growth: 0 },
    clusters: { total: 0, active: 0, avgMembers: 0 },
    rewards: { total: 0, claimed: 0, avgCost: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [taskCompletionData, setTaskCompletionData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('users');

  useEffect(() => {
    fetchAnalytics();
    fetchRecentActivity();
    fetchUserGrowthData();
    fetchTaskCompletionData();
    fetchTopUsers();
  }, [timeRange]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get new users (last 7 days)
      const { count: newUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', getDateRange());

      // Get active users (have completed tasks in last 7 days)
      const { data: activeUsersData } = await supabase
        .from('tasks')
        .select('user_id')
        .gte('completed_at', getDateRange())
        .eq('is_completed', true);

      const activeUsers = new Set(activeUsersData?.map(t => t.user_id)).size;

      // Get tasks stats
      const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true });

      const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', true);

      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Get clusters stats
      const { data: clusters } = await supabase
        .from('clusters')
        .select('*, cluster_memberships(count)');

      // Get rewards stats
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*');

      const { data: claimedRewards } = await supabase
        .from('user_rewards')
        .select('*');

      setAnalytics({
        users: {
          total: totalUsers || 0,
          new: newUsers || 0,
          active: activeUsers || 0,
          growth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0
        },
        tasks: {
          total: totalTasks || 0,
          completed: completedTasks || 0,
          completionRate: completionRate.toFixed(1),
          growth: 12.5
        },
        clusters: {
          total: clusters?.length || 0,
          active: clusters?.filter(c => c.cluster_memberships?.[0]?.count > 0).length || 0,
          avgMembers: clusters?.length > 0 
            ? (clusters.reduce((sum, c) => sum + (c.cluster_memberships?.[0]?.count || 0), 0) / clusters.length).toFixed(1)
            : 0
        },
        rewards: {
          total: rewards?.length || 0,
          claimed: claimedRewards?.length || 0,
          avgCost: rewards?.length > 0 
            ? (rewards.reduce((sum, r) => sum + r.xp_cost, 0) / rewards.length).toFixed(0)
            : 0
        }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentActivity() {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('*, users(name)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setRecentActivity(data);
    }
  }

  async function fetchUserGrowthData() {
    // Sample data - replace with actual query
    setUserGrowthData([
      { date: 'Week 1', users: 45 },
      { date: 'Week 2', users: 62 },
      { date: 'Week 3', users: 78 },
      { date: 'Week 4', users: 95 },
      { date: 'Week 5', users: 112 },
      { date: 'Week 6', users: 134 }
    ]);
  }

  async function fetchTaskCompletionData() {
    setTaskCompletionData([
      { day: 'Mon', completed: 45, created: 78 },
      { day: 'Tue', completed: 52, created: 85 },
      { day: 'Wed', completed: 48, created: 72 },
      { day: 'Thu', completed: 61, created: 90 },
      { day: 'Fri', completed: 58, created: 83 },
      { day: 'Sat', completed: 32, created: 45 },
      { day: 'Sun', completed: 28, created: 40 }
    ]);
  }

  async function fetchTopUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, total_xp, nebula_coins, role')
      .order('total_xp', { ascending: false })
      .limit(10);

    if (!error && data) {
      setTopUsers(data);
    }
  }

  function getDateRange() {
    const now = new Date();
    switch(timeRange) {
      case '7d': return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30d': return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90d': return new Date(now.setDate(now.getDate() - 90)).toISOString();
      default: return new Date(now.setDate(now.getDate() - 30)).toISOString();
    }
  }

  const getActionIcon = (action) => {
    const icons = {
      'login': '🔐',
      'task_create': '📝',
      'task_complete': '✅',
      'cluster_join': '👥',
      'reward_claim': '🎁',
      'xp_earn': '⭐'
    };
    return icons[action] || '📌';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-[var(--text-primary)] text-sm">Monitor platform performance and user engagement</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-white/5 text-[var(--text-primary)] hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-5 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">👥</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                analytics.users.growth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {analytics.users.growth}% growth
              </span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{analytics.users.total}</div>
            <div className="text-sm text-[var(--text-primary)]/70">Total Users</div>
            <div className="flex gap-3 mt-3 text-xs">
              <span className="text-green-400">+{analytics.users.new} new</span>
              <span className="text-purple-400">{analytics.users.active} active</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">📋</span>
              <span className="text-xs text-purple-400">{analytics.tasks.completionRate}% rate</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{analytics.tasks.total}</div>
            <div className="text-sm text-[var(--text-primary)]/70">Total Tasks</div>
            <div className="flex gap-3 mt-3 text-xs">
              <span className="text-green-400">{analytics.tasks.completed} completed</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-5 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{analytics.clusters.total}</div>
            <div className="text-sm text-[var(--text-primary)]/70">Active Clusters</div>
            <div className="flex gap-3 mt-3 text-xs">
              <span className="text-cyan-400">Avg {analytics.clusters.avgMembers} members</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl p-5 border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🎁</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{analytics.rewards.claimed}</div>
            <div className="text-sm text-[var(--text-primary)]/70">Rewards Claimed</div>
            <div className="flex gap-3 mt-3 text-xs">
              <span className="text-purple-400">Avg {analytics.rewards.avgCost} XP</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-[var(--surface)]/60 rounded-xl p-5 border border-white/10">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">User Growth</h3>
            <div className="h-64 flex items-end gap-3">
              {userGrowthData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-lg transition-all hover:opacity-80"
                    style={{ height: `${(item.users / Math.max(...userGrowthData.map(d => d.users))) * 200}px` }}
                  />
                  <span className="text-xs text-[var(--text-primary)]/60">{item.date}</span>
                  <span className="text-xs text-white">{item.users}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Completion Chart */}
          <div className="bg-[var(--surface)]/60 rounded-xl p-5 border border-white/10">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-4">Task Activity (Last 7 Days)</h3>
            <div className="space-y-3">
              {taskCompletionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-[var(--text-primary)]">{item.day}</span>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div 
                        className="h-6 bg-cyan-500/60 rounded"
                        style={{ width: `${(item.completed / Math.max(...taskCompletionData.map(d => d.created))) * 100}%` }}
                      />
                      <div 
                        className="h-6 bg-purple-500/60 rounded"
                        style={{ width: `${(item.created / Math.max(...taskCompletionData.map(d => d.created))) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-cyan-400">{item.completed}</span>
                    <span className="text-purple-400">{item.created}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-white/10">
              <span className="text-xs flex items-center gap-1"><div className="w-3 h-3 bg-cyan-500/60 rounded"></div> Completed</span>
              <span className="text-xs flex items-center gap-1"><div className="w-3 h-3 bg-purple-500/60 rounded"></div> Created</span>
            </div>
          </div>
        </div>

        {/* Top Users & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Users */}
          <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">🏆 Top Contributors</h3>
            </div>
            <div className="divide-y divide-white/10">
              {topUsers.map((user, idx) => (
                <div key={user.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold ${
                      idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-[var(--text-primary)]/50'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-[var(--text-primary)]/60">{user.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">{user.total_xp.toLocaleString()} XP</div>
                    <div className="text-xs text-[var(--text-primary)]/60">{user.nebula_coins} ₦</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">📡 Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-primary)]/60">
                  No recent activity to display
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/5 transition">
                    <span className="text-xl">{getActionIcon(activity.action)}</span>
                    <div className="flex-1">
                      <div className="text-sm text-white">
                        <span className="font-medium">{activity.users?.name || 'User'}</span>
                        <span className="text-[var(--text-primary)]/70 ml-1">{activity.action?.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-[var(--text-primary)]/50">
                        {new Date(activity.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        )}
      </div>
    </div>
  );
}