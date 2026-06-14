'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function RewardCatalog() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [rewardToDelete, setRewardToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalRedemptions: 0,
    lowStock: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    xp_cost: '',
    stock_count: -1
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  async function fetchRewards() {
    setLoading(true);
    try {
      // Fetch all rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .order('xp_cost', { ascending: true });

      if (rewardsError) throw rewardsError;

      // Get redemption counts for each reward
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('user_rewards')
        .select('reward_id');

      if (redemptionsError) throw redemptionsError;

      // Count redemptions per reward
      const redemptionCounts = {};
      redemptionsData?.forEach(r => {
        redemptionCounts[r.reward_id] = (redemptionCounts[r.reward_id] || 0) + 1;
      });

      // Add redemption count to rewards
      const rewardsWithCounts = (rewardsData || []).map(reward => ({
        ...reward,
        redemption_count: redemptionCounts[reward.id] || 0
      }));

      setRewards(rewardsWithCounts);

      // Calculate stats
      setStats({
        total: rewardsWithCounts.length,
        totalRedemptions: redemptionsData?.length || 0,
        lowStock: rewardsWithCounts.filter(r => r.stock_count !== -1 && r.stock_count < 10).length
      });

    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReward() {
    if (!formData.title || !formData.xp_cost) {
      alert('Please fill in required fields');
      return;
    }

    const { error } = await supabase
      .from('rewards')
      .insert({
        title: formData.title,
        description: formData.description || null,
        xp_cost: parseInt(formData.xp_cost),
        stock_count: formData.stock_count === '' ? -1 : parseInt(formData.stock_count)
      });

    if (error) {
      console.error('Error adding reward:', error);
      alert('Failed to add reward');
    } else {
      fetchRewards();
      setShowAddModal(false);
      resetForm();
      alert('Reward added successfully!');
    }
  }

  async function handleEditReward() {
    if (!editingReward) return;

    const { error } = await supabase
      .from('rewards')
      .update({
        title: formData.title,
        description: formData.description || null,
        xp_cost: parseInt(formData.xp_cost),
        stock_count: formData.stock_count === '' ? -1 : parseInt(formData.stock_count)
      })
      .eq('id', editingReward.id);

    if (error) {
      console.error('Error updating reward:', error);
      alert('Failed to update reward');
    } else {
      fetchRewards();
      setShowEditModal(false);
      setEditingReward(null);
      resetForm();
      alert('Reward updated successfully!');
    }
  }

  async function handleDeleteReward() {
    if (!rewardToDelete) return;

    // Check if reward has been redeemed
    const { count, error: checkError } = await supabase
      .from('user_rewards')
      .select('*', { count: 'exact', head: true })
      .eq('reward_id', rewardToDelete.id);

    if (checkError) {
      console.error('Error checking redemptions:', checkError);
    }

    if (count > 0) {
      alert(`Cannot delete this reward. It has been redeemed ${count} time(s). Consider marking it as inactive instead.`);
      setShowDeleteConfirm(false);
      setRewardToDelete(null);
      return;
    }

    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardToDelete.id);

    if (error) {
      console.error('Error deleting reward:', error);
      alert('Failed to delete reward');
    } else {
      fetchRewards();
      setShowDeleteConfirm(false);
      setRewardToDelete(null);
      alert('Reward deleted successfully!');
    }
  }

  async function updateStock(rewardId, newStock) {
    const stockValue = newStock === '' || newStock === -1 ? -1 : parseInt(newStock);
    const { error } = await supabase
      .from('rewards')
      .update({ stock_count: stockValue })
      .eq('id', rewardId);

    if (!error) {
      fetchRewards();
    }
  }

  function openEditModal(reward) {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description || '',
      xp_cost: reward.xp_cost,
      stock_count: reward.stock_count
    });
    setShowEditModal(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      xp_cost: '',
      stock_count: -1
    });
  }

  const getStockDisplay = (stock) => {
    if (stock === -1) return { text: 'Unlimited', color: 'text-green-400' };
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-400' };
    if (stock < 10) return { text: `${stock} left`, color: 'text-orange-400' };
    return { text: `${stock} left`, color: 'text-cyan-400' };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white mb-2">Reward Catalog</h1>
            <p className="text-[var(--text-primary)] text-sm">Manage rewards that users can redeem with their XP</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="button-gradient px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add New Reward
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Total Rewards</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{stats.totalRedemptions}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Total Redemptions</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-orange-400">{stats.lowStock}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Low Stock Items</div>
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
            <h3 className="text-white font-medium mb-2">No rewards yet</h3>
            <p className="text-[var(--text-primary)] text-sm mb-4">Create your first reward to start the catalog</p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="button-gradient px-4 py-2 rounded-lg text-white text-sm"
            >
              Create Reward
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
              >
                <div className="p-5">
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

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>
                      <span className="text-[var(--text-primary)]/60">Stock:</span>
                      <span className={`ml-2 ${getStockDisplay(reward.stock_count).color}`}>
                        {getStockDisplay(reward.stock_count).text}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-primary)]/60">Redeemed:</span>
                      <span className="ml-2 text-white">{reward.redemption_count || 0}</span>
                    </div>
                  </div>

                  {/* Stock Update */}
                  <div className="mb-4">
                    <label className="text-xs text-[var(--text-primary)]/60 block mb-1">Update Stock</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={reward.stock_count === -1 ? '' : reward.stock_count}
                        onChange={(e) => updateStock(reward.id, e.target.value)}
                        placeholder="Unlimited"
                        className="flex-1 px-3 py-1.5 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={() => updateStock(reward.id, -1)}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition"
                      >
                        ∞
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => openEditModal(reward)}
                      className="flex-1 py-2 rounded-lg bg-white/5 text-sm text-[var(--text-primary)] hover:bg-cyan-500/20 hover:text-cyan-400 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setRewardToDelete(reward);
                        setShowDeleteConfirm(true);
                      }}
                      className="flex-1 py-2 rounded-lg bg-white/5 text-sm text-[var(--text-primary)] hover:bg-red-500/20 hover:text-red-400 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Reward Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md border border-white/10">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Add New Reward</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., Amazon Gift Card - $10"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                    placeholder="Describe the reward..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">XP Cost *</label>
                  <input
                    type="number"
                    value={formData.xp_cost}
                    onChange={(e) => setFormData({...formData, xp_cost: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">Stock Count (-1 for unlimited)</label>
                  <input
                    type="number"
                    value={formData.stock_count}
                    onChange={(e) => setFormData({...formData, stock_count: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReward}
                  className="flex-1 px-4 py-2 button-gradient rounded-lg text-white"
                >
                  Add Reward
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Reward Modal */}
        {showEditModal && editingReward && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md border border-white/10">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Edit Reward</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">XP Cost *</label>
                  <input
                    type="number"
                    value={formData.xp_cost}
                    onChange={(e) => setFormData({...formData, xp_cost: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-primary)] mb-1">Stock Count (-1 for unlimited)</label>
                  <input
                    type="number"
                    value={formData.stock_count}
                    onChange={(e) => setFormData({...formData, stock_count: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingReward(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditReward}
                  className="flex-1 px-4 py-2 button-gradient rounded-lg text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && rewardToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md border border-red-500/30">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-red-400">Delete Reward</h3>
              </div>
              <div className="p-5">
                <p className="text-white mb-2">Are you sure you want to delete <strong>{rewardToDelete.title}</strong>?</p>
                <p className="text-xs text-[var(--text-primary)]/70">
                  {rewardToDelete.redemption_count > 0 
                    ? `This reward has been redeemed ${rewardToDelete.redemption_count} time(s). You cannot delete it.`
                    : 'This action cannot be undone.'}
                </p>
              </div>
              <div className="p-5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setRewardToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                {rewardToDelete.redemption_count === 0 && (
                  <button
                    onClick={handleDeleteReward}
                    className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    Delete Permanently
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}