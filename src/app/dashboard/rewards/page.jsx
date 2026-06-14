'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  const [userRedemptions, setUserRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    
    fetchRewards();
    fetchUserRedemptions(parsedUser.id);
  }, [router]);

  async function fetchRewards() {
    setLoading(true);
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('xp_cost', { ascending: true });
    
    if (error) {
      console.error("Catalog Fetch Error:", error);
    } else {
      // Filter out of stock rewards
      const availableRewards = (data || []).filter(r => r.stock_count !== 0);
      setRewards(availableRewards);
    }
    setLoading(false);
  }

  async function fetchUserRedemptions(userId) {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('reward_id')
      .eq('user_id', userId);

    if (!error && data) {
      setUserRedemptions(data.map(r => r.reward_id));
    }
  }

  function handleClaimClick(reward) {
    if (!user || !user.id) return;
    if (user.total_xp < reward.xp_cost) {
      alert(`Insufficient XP. You need ${reward.xp_cost - user.total_xp} more XP.`);
      return;
    }
    
    // Check if already redeemed
    if (userRedemptions.includes(reward.id)) {
      alert('You have already claimed this reward');
      return;
    }
    
    setSelectedReward(reward);
    setShowConfirmModal(true);
  }

  async function handleConfirmClaim() {
    if (!selectedReward || !user) return;
    
    setClaiming(selectedReward.id);
    setShowConfirmModal(false);

    try {
      // Call the SQL function
      const { data, error } = await supabase.rpc('claim_reward', {
        target_user_id: user.id,
        target_reward_id: selectedReward.id,
        cost: selectedReward.xp_cost
      });

      if (error) throw new Error(error.message);

      if (data && data.success === false) {
        alert(data.error);
        setClaiming(null);
        return;
      }

      // Update local user state
      const newXp = user.total_xp - selectedReward.xp_cost;
      const updatedUser = { ...user, total_xp: newXp };
      setUser(updatedUser);
      localStorage.setItem('nebula_session', JSON.stringify(updatedUser));
      
      // Update redemptions list
      setUserRedemptions([...userRedemptions, selectedReward.id]);
      
      // Update stock display
      fetchRewards();
      
      alert(`Success! "${selectedReward.title}" has been added to your inventory.`);
      
    } catch (err) {
      console.error("RPC Claim Error:", err);
      alert("Claim failed: " + err.message);
    } finally {
      setClaiming(null);
      setSelectedReward(null);
    }
  }

  const getStockBadge = (stock) => {
    if (stock === -1) return { text: 'Unlimited', color: 'text-green-400', bg: 'bg-green-500/10' };
    if (stock === 0) return { text: 'Sold Out', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (stock < 5) return { text: `${stock} left`, color: 'text-orange-400', bg: 'bg-orange-500/10' };
    return { text: `${stock} left`, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white">Rewards Bazaar</h1>
          <p className="text-[var(--text-primary)] text-sm mt-1">Exchange your earned XP for exclusive rewards</p>
        </div>
        <div className="bg-[var(--surface)]/60 rounded-xl px-5 py-3 border border-white/10 text-center">
          <p className="text-[10px] text-gray-500 font-['JetBrains_Mono'] uppercase tracking-wider">Your XP Balance</p>
          <p className="text-2xl font-bold text-cyan-400 font-['JetBrains_Mono']">{user?.total_xp || 0} XP</p>
        </div>
      </div>

      {/* Rewards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      ) : rewards.length === 0 ? (
        <div className="bg-[var(--surface)]/60 rounded-xl p-12 text-center border border-white/10">
          <span className="text-5xl mb-3 block">🎁</span>
          <h3 className="text-white font-medium mb-2">No rewards available</h3>
          <p className="text-[var(--text-primary)] text-sm">Check back later for new rewards!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((reward) => {
            const alreadyClaimed = userRedemptions.includes(reward.id);
            const canAfford = user && user.total_xp >= reward.xp_cost;
            const inStock = reward.stock_count !== 0;
            const stockInfo = getStockBadge(reward.stock_count);
            
            return (
              <div
                key={reward.id}
                className={`bg-[var(--surface)]/60 rounded-xl border p-5 transition-all ${
                  alreadyClaimed 
                    ? 'border-green-500/30 opacity-60' 
                    : canAfford && inStock
                      ? 'border-cyan-500/30 hover:scale-[1.02] cursor-pointer'
                      : 'border-white/10 opacity-50'
                }`}
                onClick={() => !alreadyClaimed && canAfford && inStock && handleClaimClick(reward)}
              >
                {/* Title & Cost */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-['Space_Grotesk'] font-semibold text-white text-lg flex-1">
                    {reward.title}
                  </h3>
                  <div className="text-right">
                    <span className="text-xl font-bold text-cyan-400">{reward.xp_cost}</span>
                    <span className="text-xs text-[var(--text-primary)]"> XP</span>
                  </div>
                </div>

                {/* Description */}
                {reward.description && (
                  <p className="text-sm text-[var(--text-primary)]/70 mb-4 line-clamp-2">
                    {reward.description}
                  </p>
                )}

                {/* Stock Badge */}
                <div className="mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${stockInfo.bg} ${stockInfo.color}`}>
                    📦 {stockInfo.text}
                  </span>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                  {alreadyClaimed ? (
                    <span className="text-sm text-green-400 flex items-center gap-2">
                      <span>✓</span> Already Claimed
                    </span>
                  ) : !canAfford ? (
                    <span className="text-sm text-red-400">
                      Need {reward.xp_cost - user.total_xp} more XP
                    </span>
                  ) : !inStock ? (
                    <span className="text-sm text-red-400">Out of Stock</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimClick(reward);
                      }}
                      disabled={claiming === reward.id}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                        claiming === reward.id
                          ? 'bg-gray-600 text-white cursor-wait'
                          : 'button-gradient'
                      }`}
                    >
                      {claiming === reward.id ? 'Processing...' : 'Claim Reward'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedReward && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md border border-cyan-500/30">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Confirm Claim</h3>
            </div>
            <div className="p-5">
              <p className="text-white mb-2">
                Claim <strong className="text-cyan-400">{selectedReward.title}</strong>?
              </p>
              <p className="text-sm text-[var(--text-primary)]/70 mb-2">
                Cost: <span className="text-cyan-400">{selectedReward.xp_cost} XP</span>
              </p>
              <p className="text-xs text-yellow-400/70">
                This action cannot be undone.
              </p>
            </div>
            <div className="p-5 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClaim}
                className="flex-1 px-4 py-2 button-gradient rounded-lg text-white"
              >
                Confirm Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}