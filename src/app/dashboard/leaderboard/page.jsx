'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LeaderboardDashboardNode() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [globalUsers, setGlobalUsers] = useState([]);
  const [clusterPerformance, setClusterPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlider, setActiveSlider] = useState('global'); // 'global' | 'cluster'

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) return router.push('/login');
    
    const parsedUser = JSON.parse(session);
    setCurrentUser(parsedUser);

    const pullLeaderboardDataMatrix = async () => {
      try {
        // 1. Pull Global Users Rank Sorted by total_xp
        const { data: gUsers } = await supabase
          .from('leaderboard_global_users')
          .select('*')
          .order('total_xp', { ascending: false });
        setGlobalUsers(gUsers || []);

        // 2. Pull Dynamic N-Row Cluster Efficiency Standings
        const { data: cPerf } = await supabase
          .from('leaderboard_cluster_efficiency')
          .select('*')
          .order('efficiency_percentage', { ascending: false });
        setClusterPerformance(cPerf || []);

      } catch (err) {
        console.error("Leaderboard pipeline synchronizer error context:", err);
      } finally {
        setLoading(false);
      }
    };

    pullLeaderboardDataMatrix();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-cyan-400 animate-pulse">SYNCHRONIZING GLOBAL AND SECTOR LEADERBOARD REGISTERS...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-white font-['Inter']">
      
      {/* Top Header Row Panel */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/cluster')} className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors uppercase font-bold tracking-wider">
          ⇦ Return to Room Grid Hub
        </button>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 px-2.5 py-0.5 rounded border border-cyan-500/10 font-bold uppercase tracking-widest">
          Platform Ranks Feed Live
        </span>
      </div>

      {/* Title Segment Card Banner */}
      <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-widest block">RoboKranti Standing Matrix</span>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#dae2fd]">Performance Leaderboards</h1>
          <p className="text-xs text-gray-400 mt-0.5">Review global talent progression levels and workspace completion metrics across real-time operations.</p>
        </div>

        {/* Sliding Navigation Control System */}
        <div className="p-1 bg-black/40 rounded-xl border border-white/5 flex gap-1 self-start sm:self-center shrink-0">
          <button 
            onClick={() => setActiveSlider('global')}
            className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeSlider === 'global' ? 'bg-cyan-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            👤 Global Users
          </button>
          <button 
            onClick={() => setActiveSlider('cluster')}
            className={`px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeSlider === 'cluster' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            🔮 Cluster Sector Rows
          </button>
        </div>
      </div>

      {/* 📊 INTERFACE DISPLAY: (1) GLOBAL XP LEADERBOARD */}
      {activeSlider === 'global' && (
        <div className="bg-[#131315]/40 border border-white/10 rounded-2xl p-4 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">User Core Identifier</th>
                  <th className="py-3 px-4">Progression Level</th>
                  <th className="py-3 px-4 text-right">Accumulated Weight</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 font-mono">
                {globalUsers.map((item, index) => {
                  const isMe = item.user_id === currentUser?.id;
                  const rankNumber = index + 1;
                  return (
                    <tr key={item.user_id} className={`transition-colors ${isMe ? 'bg-cyan-500/5 text-cyan-300 font-bold' : 'hover:bg-white/5 text-gray-300'}`}>
                      <td className="py-3.5 px-4 font-bold">
                        {rankNumber === 1 ? '🥇 01' : rankNumber === 2 ? '🥈 02' : rankNumber === 3 ? '🥉 03' : rankNumber < 10 ? `0${rankNumber}` : rankNumber}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-200">{item.name || item.email.split('@')[0]} {isMe && '(You)'}</span>
                          <span className="text-[10px] font-mono text-gray-500">{item.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-bold text-purple-400">
                          LVL {item.current_level || 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-green-400">
                        {item.total_xp} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📊 INTERFACE DISPLAY: (2) CLUSTER EFFICIENCY LEADERBOARD (N-ROWS DECK) */}
      {activeSlider === 'cluster' && (
        <div className="bg-[#131315]/40 border border-white/10 rounded-2xl p-4 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Operational Sector Cluster</th>
                  <th className="py-3 px-4">Assigned Member Node</th>
                  <th className="py-3 px-4">Task Resolution Weight</th>
                  <th className="py-3 px-4 text-right">Velocity Efficiency</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 font-mono">
                {clusterPerformance.map((row, index) => {
                  const isMe = row.user_id === currentUser?.id;
                  return (
                    <tr key={row.membership_row_id} className={`transition-colors ${isMe ? 'bg-purple-500/5 text-purple-300 font-bold' : 'hover:bg-white/5 text-gray-300'}`}>
                      <td className="py-3.5 px-4 font-sans font-bold text-cyan-400">
                        📁 {row.cluster_name}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-semibold">{row.user_name || row.user_email.split('@')[0]} {isMe && '(You)'}</span>
                          <span className="text-[9px] font-mono text-gray-500">{row.user_email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        <span className="text-white font-bold">{row.completed_tasks}</span> / {row.total_tasks} cleared
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-block text-right">
                          <span className={`text-xs font-bold tracking-tight px-2 py-0.5 rounded font-mono ${
                            row.efficiency_percentage >= 75 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            row.efficiency_percentage >= 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {row.efficiency_percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}