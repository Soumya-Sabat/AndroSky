'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalXp: 0,
    nebulaCoins: 100,
    currentLevel: 1,
    currentStreak: 0,
    completedTasksCount: 0,
    pendingTasksCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(session);
      processSessionAndMetrics(userData);
    } catch (error) {
      console.error('Telemetry structural crash:', error);
      router.push('/login');
    }
  }, [router]);

  // 🧠 Core Login Streak Validation & Database Aggregation Engine
  const processSessionAndMetrics = async (profile) => {
    try {
      // 1. Fetch real-time core metrics profile row from database
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (userError || !dbUser) throw userError || new Error("Profile not mapped");

      const now = new Date();
      let updatedStreak = dbUser.current_streak || 0;
      let lastLoginStr = dbUser.last_login_at;

      if (lastLoginStr) {
        const lastLoginDate = new Date(lastLoginStr);
        
        // Calculate difference in absolute hours
        const hourDifference = Math.abs(now - lastLoginDate) / 3600000;

        // Reset threshold: User missed the 48-hour terminal grace window
        if (hourDifference > 48) {
          updatedStreak = 1; 
        } 
        // Consecutive cycle validation: More than 18 hours have passed, but within 48 hours
        else if (hourDifference >= 18 && now.getDate() !== lastLoginDate.getDate()) {
          updatedStreak += 1;
        }
      } else {
        // Absolute first initialization cycle
        updatedStreak = 1;
      }

      // Update the user profile document stamp state inside Supabase
        const { error: patchError } = await supabase
          .from('users')
          .update({
            current_streak: updatedStreak,
            last_login_at: now.toISOString()
          })
          .eq('id', profile.id);

        if (patchError) {
          // CRITICAL FIX: Destructure explicitly into raw text literals so devtools can't print {}
          const errCode = patchError.code || "UNKNOWN_CODE";
          const errMsg = patchError.message || "No message provided by Supabase client";
          const errDetails = patchError.details || "No secondary details available";
          
          console.error(`🚨 [DB FAULT] Code: ${errCode} | Message: ${errMsg} | Details: ${errDetails}`);
        }

      // 2. Aggregate counts from task rows
      const { data: taskData } = await supabase
        .from('tasks')
        .select('is_completed')
        .eq('user_id', profile.id);

      const completed = taskData ? taskData.filter(t => t.is_completed).length : 0;
      const pending = taskData ? taskData.filter(t => !t.is_completed).length : 0;

      // Update structural runtime configurations states
      const synchronizedUser = { 
        ...dbUser, 
        current_streak: updatedStreak,
        last_login_at: now.toISOString() 
      };
      
      setUser(synchronizedUser);
      localStorage.setItem('nebula_session', JSON.stringify(synchronizedUser));

      setStats({
        totalXp: dbUser.total_xp || 0,
        nebulaCoins: dbUser.nebula_coins || 0,
        currentLevel: dbUser.current_level || 1,
        currentStreak: updatedStreak,
        completedTasksCount: completed,
        pendingTasksCount: pending
      });

    } catch (err) {
      console.error("Metrics engine sync failure:", err);
      // Fallback state mapping from cached local data context if offline
      setUser(profile);
      setStats(prev => ({
        ...prev,
        totalXp: profile.total_xp || 0,
        nebulaCoins: profile.nebula_coins || 100,
        currentLevel: profile.current_level || 1,
        currentStreak: profile.current_streak || 0
      }));
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Level Progression Calculation Formula Matrix
  const targetXpThreshold = 2700;
  const progressPercentage = Math.min(Math.round((stats.totalXp / targetXpThreshold) * 100), 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter']">
      
      {/* Welcome Header */}
      <div>
        <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{user?.name || 'Commander'}</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Dynamic core metrics and diagnostic subsystem graphs online.
        </p>
      </div>

      {/* Stats Row - 4 core components */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total XP */}
        <div className="bg-[#131315]/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">⭐</span>
            <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500 uppercase tracking-wider">Total Core</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.totalXp}</div>
          <div className="text-xs text-gray-400 mt-1">XP Capitalized</div>
        </div>

        {/* Card 2: Balance Coins */}
        <div className="bg-[#131315]/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">💰</span>
            <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500 uppercase tracking-wider">Balance</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.nebulaCoins}</div>
          <div className="text-xs text-gray-400 mt-1">Nebula Coins</div>
        </div>

        {/* Card 3: Rank Level */}
        <div className="bg-[#131315]/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🏅</span>
            <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500 uppercase tracking-wider">Rank Index</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">Lv.{stats.currentLevel}</div>
          <div className="text-xs text-gray-400 mt-1">Commander Tier</div>
        </div>

        {/* Card 4: Dynamic 24h Checked Login Streak */}
        <div className="bg-[#131315]/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl animate-pulse">🔥</span>
            <span className="text-[10px] font-['JetBrains_Mono'] text-orange-400 uppercase tracking-wider font-bold">24H Active Loop</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.currentStreak} Days</div>
          <div className="text-xs text-gray-400 mt-1">Consecutive Logins</div>
        </div>
      </div>

      {/* Level Progress Bar Box Component */}
      <div className="bg-[#131315]/40 backdrop-blur-md rounded-2xl p-5 border border-white/10">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300 font-medium">Evolution Level Progress</span>
          <span className="text-cyan-400 font-['JetBrains_Mono'] text-xs font-bold bg-cyan-400/10 px-2 py-0.5 rounded">
            {progressPercentage}%
          </span>
        </div>
        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-gray-500 uppercase tracking-widest mt-2.5">
          <span>Nova Seed Baseline</span>
          <span>Galaxy Sovereign Tier</span>
        </div>
      </div>

      {/* 📊 DYNAMIC ANALYTICS PLOT GRID ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Sub-component A: Core Pipeline Efficiency Ratios */}
        <div className="bg-[#131315]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider mb-1 text-purple-300">
              📊 Production Metrics Summary
            </h3>
            <p className="text-[11px] text-gray-500 font-mono mb-4">Task fulfillment ratios across custom columns.</p>
          </div>
          
          <div className="space-y-4 my-auto">
            <div className="flex justify-between items-end text-xs">
              <span className="text-gray-400">Active Operational Tasks</span>
              <span className="font-bold text-white text-base">{stats.pendingTasksCount}</span>
            </div>
            <div className="flex justify-between items-end text-xs">
              <span className="text-gray-400">Vaulted & Terminated Logged Tasks</span>
              <span className="font-bold text-green-400 text-base">{stats.completedTasksCount}</span>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-['JetBrains_Mono'] uppercase">Gross Output Ratio</span>
              <span className="font-['JetBrains_Mono'] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                {stats.pendingTasksCount + stats.completedTasksCount > 0 
                  ? Math.round((stats.completedTasksCount / (stats.pendingTasksCount + stats.completedTasksCount)) * 100) 
                  : 0}% Efficiency
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Sub-component B: Visual XP Generation Telemetry Graph */}
        <div className="bg-[#131315]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider mb-0.5">
                📈 Core Performance Vector Graph
              </h3>
              <p className="text-[11px] text-gray-500 font-mono">Simulated tracking of resource acquisition loops over operational history.</p>
            </div>
            <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-1 bg-white/5 rounded text-gray-400 uppercase">Live Trace</span>
          </div>

          {/* Core Graphical Simulation Primitives Plot Map Bars */}
          <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2 bg-black/20 rounded-xl border border-white/5 relative">
            <div className="absolute left-3 top-2 text-[9px] font-mono text-gray-600 uppercase tracking-widest">Amplitude (Normalized Data Streams)</div>
            
            {/* Normalized Historical Blocks tracking vectors data rows */}
            {[
              { label: 'Mon', h: 'h-[30%]', xp: '+10', active: false },
              { label: 'Tue', h: 'h-[45%]', xp: '+25', active: false },
              { label: 'Wed', h: 'h-[20%]', xp: '+5', active: false },
              { label: 'Thu', h: 'h-[60%]', xp: '+40', active: false },
              { label: 'Fri', h: 'h-[85%]', xp: '+110', active: true },
              { label: 'Sat', h: 'h-[50%]', xp: '+30', active: false },
              { label: 'Sun', h: `${Math.max(15, Math.min(progressPercentage, 95))}%`, xp: `+${stats.totalXp % 100}`, active: true }
            ].map((bar, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer relative">
                
                {/* Micro Tooltip Hover display bubble elements */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-cyan-500 text-black font-['JetBrains_Mono'] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg pointer-events-none">
                  {bar.xp}XP
                </div>

                {/* Graph Vertical Data Line Block */}
                <div className={`w-full ${bar.h} rounded-t-md transition-all duration-500 ease-out ${
                  bar.active 
                    ? "bg-gradient-to-t from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                    : "bg-white/10 group-hover:bg-white/20"
                }`} />

                <span className="text-[10px] font-['JetBrains_Mono'] text-gray-500 mt-2 block uppercase">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}