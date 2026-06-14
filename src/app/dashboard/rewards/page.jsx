'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    
    fetchRewards();
  }, [router]);

  async function fetchRewards() {
    setLoading(true);
    // Fetch from catalog
    const { data, error } = await supabase.from('rewards').select('*');
    
    if (error) {
      console.error("Catalog Fetch Error:", error);
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  }

async function handleClaim(reward) {
    if (!user || !user.id) return;
    if (user.total_xp < reward.xp_cost) {
      alert("Insufficient XP balance.");
      return;
    }

    setClaiming(reward.id);

    try {
      // Call the SQL function we just created
      const { error } = await supabase.rpc('claim_reward', {
        target_user_id: user.id,
        target_reward_id: reward.id,
        cost: reward.xp_cost
      });

      if (error) throw new Error(error.message);

      // Success
      const newXp = user.total_xp - reward.xp_cost;
      const updatedUser = { ...user, total_xp: newXp };
      setUser(updatedUser);
      localStorage.setItem('nebula_session', JSON.stringify(updatedUser));
      
      alert(`Success! "${reward.title}" added to inventory.`);
      window.location.reload(); // Simple refresh to sync UI
    } catch (err) {
      console.error("RPC Claim Error:", err);
      alert("Claim failed: " + err.message);
    } finally {
      setClaiming(null);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto text-white font-['Inter']">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-[#dae2fd]">Rewards Bazaar</h1>
          <p className="text-gray-400 text-sm mt-1">Exchange your earned XP for exclusive workspace assets.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-mono uppercase">Current Balance</p>
          <p className="text-2xl font-bold text-cyan-400 font-mono">{user?.total_xp || 0} XP</p>
        </div>
      </div>

      {loading ? (
        <div className="text-cyan-400 font-mono animate-pulse">Initializing bazaar...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((r) => (
            <div key={r.id} className="p-6 bg-[#131315]/60 border border-white/10 rounded-2xl flex flex-col hover:border-purple-500/50 transition-all">
              <h2 className="text-lg font-bold text-white">{r.title}</h2>
              <p className="text-xs text-gray-400 mt-2 mb-6 flex-1">{r.description}</p>
              
              <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-4">
                <span className="text-sm font-bold text-cyan-400">{r.xp_cost} XP</span>
                <button 
                  disabled={claiming === r.id || (user?.total_xp < r.xp_cost)}
                  onClick={() => handleClaim(r)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    claiming === r.id ? 'bg-gray-600' : 
                    user?.total_xp < r.xp_cost ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 
                    'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {claiming === r.id ? 'Processing...' : 'Claim'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}