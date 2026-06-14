'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AchievementsDashboardNode() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [globalAchievements, setGlobalAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);

    const pullAchievementsDataPayload = async () => {
      try {
        // 1. Fetch all system badges defined in database catalog
        const { data: globalCatalog, error: errC } = await supabase
          .from('achievements')
          .select('*')
          .order('xp_reward', { ascending: true });
        
        if (errC) throw errC;
        setGlobalAchievements(globalCatalog || []);

        // 2. Fetch badges explicitly unlocked by this user identity
        const { data: earnedReceipts, error: errR } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', parsedUser.id);

        if (errR) throw errR;

        // Map IDs into a hash Set for O(1) lightning fast layout rendering lookups
        const unlockedSet = new Set(earnedReceipts?.map(r => r.achievement_id));
        setUnlockedIds(unlockedSet);

      } catch (err) {
        console.error("Achievements telemetry loading exception failed:", err);
      } finally {
        setLoading(false);
      }
    };

    pullAchievementsDataPayload();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-xs font-mono text-purple-400 animate-pulse">EXTRACTING EARNED PROGRESSION TROPHY RECOGNITION LEDGER...</div>;
  }

  // Calculate Real Meta Progress Ratios
  const totalCount = globalAchievements.length;
  const unlockedCount = unlockedIds.size;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Filter Cards Grid array output on-the-fly
  const filteredBadges = globalAchievements.filter(badge => {
    const isUnlocked = unlockedIds.has(badge.id);
    if (activeFilter === 'unlocked') return isUnlocked;
    if (activeFilter === 'locked') return !isUnlocked;
    return true;
  });

  // Dynamic Style Mapper for Badge Tiers
  const tierThemes = {
    bronze: 'border-amber-700/30 bg-amber-900/5 text-amber-500',
    silver: 'border-slate-500/30 bg-slate-500/5 text-slate-400',
    gold: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
    legendary: 'border-purple-500/40 bg-purple-500/10 text-purple-400 animate-pulse'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-white font-['Inter']">
      
      {/* Upper Navigation Meta Row */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/cluster')} className="text-xs font-mono text-gray-500 hover:text-purple-400 transition-colors uppercase font-bold tracking-wider">
          ⇦ Return to Operations Matrix Hub
        </button>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/5 px-2.5 py-0.5 rounded border border-purple-500/10 font-bold uppercase tracking-widest">
          Gamification Sub-Router Loaded
        </span>
      </div>

      {/* Progress Dashboard Banner Summary layout */}
      <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
        <div className="relative shrink-0 w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
          <span className="text-4xl">🏆</span>
          <div className="absolute -bottom-2 -right-2 bg-black border border-purple-500/30 font-mono text-xxs px-2 py-0.5 rounded-full font-bold text-cyan-400">
            {completionPercentage}%
          </div>
        </div>

        <div className="space-y-2 flex-1 text-center md:text-left w-full">
          <span className="text-[9px] font-mono text-purple-400 uppercase font-bold tracking-widest block">Operational Accomplishments Manifest</span>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#dae2fd]">Unlocked Milestones</h1>
          
          {/* Progress Loading Bar Matrix segment tracking elements */}
          <div className="w-full bg-black/40 border border-white/5 h-2.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full transition-all duration-1000 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold text-gray-500 pt-0.5">
            <span>SYNCHRONIZED DECK MATRIX STATUS</span>
            <span className="text-purple-400">{unlockedCount} / {totalCount} BLUEPRINTS WENT LIVE</span>
          </div>
        </div>
      </div>

      {/* Action Filters Tabs Controls Row */}
      <div className="flex border-b border-white/10 gap-2 text-xs font-mono">
        {[
          { key: 'all', label: '🗂️ All Trophies', count: totalCount },
          { key: 'unlocked', label: '🔒 Unlocked', count: unlockedCount },
          { key: 'locked', label: '🔓 Remaining', count: totalCount - unlockedCount }
        ].map((tab) => (
          <button 
            key={tab.key} 
            onClick={() => setActiveFilter(tab.key)} 
            className={`py-2.5 px-4 uppercase font-bold tracking-wider transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${activeFilter === tab.key ? 'border-purple-400 text-purple-400 bg-purple-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            {tab.label}
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-gray-500 font-bold">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Grid Mapping Matrix layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredBadges.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-gray-500 border border-dashed border-white/5 rounded-2xl col-span-full">
            No milestones found matching your current filter.
          </div>
        ) : (
          filteredBadges.map((badge) => {
            const hasAcquired = unlockedIds.has(badge.id);
            return (
              <div 
                key={badge.id} 
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden group ${
                  hasAcquired 
                    ? 'bg-[#131315]/50 border-white/10 hover:border-purple-500/30 shadow-lg' 
                    : 'bg-black/20 border-white/5 opacity-50 grayscale select-none'
                }`}
              >
                {/* Background ambient glowing node array decoration rings */}
                {hasAcquired && (
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    {/* Badge Glyph Node container rendering */}
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl font-sans ${tierThemes[badge.tier]}`}>
                      {badge.icon}
                    </div>

                    {/* Meta tier character text badge block details */}
                    <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border ${tierThemes[badge.tier]}`}>
                      {badge.tier}
                    </span>
                  </div>

                  {/* Main description data strings summaries text layout blocks */}
                  <div>
                    <h4 className="font-['Space_Grotesk'] text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Footer XP allocation token point tracker nodes block */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Reward Payload:</span>
                  <span className={`font-bold tracking-wide ${hasAcquired ? 'text-green-400' : 'text-gray-500'}`}>
                    +{badge.xp_reward} XP
                  </span>
                </div>

                {/* Status Padlocks Overlay Indicators layout templates inside frame blocks */}
                {!hasAcquired && (
                  <div className="absolute top-2 right-2 bg-black/40 border border-white/5 text-[8px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded text-gray-600">
                    🔒 Locked
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}