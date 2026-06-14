'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  async function fetchUsers() {
    setLoading(true);
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      // Apply search
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply role filter
      if (filterRole !== 'all') {
        query = query.eq('role', filterRole);
      }

      // Apply status filter (based on is_active column if exists, otherwise filter by role)
      if (filterStatus === 'active') {
        query = query.neq('role', 'suspended');
      } else if (filterStatus === 'suspended') {
        query = query.eq('role', 'suspended');
      }

      // Pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Get cluster count for each user
      const usersWithClusterCount = await Promise.all(
        (data || []).map(async (user) => {
          const { count: clusterCount } = await supabase
            .from('user_clusters')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          const { count: taskCount } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          return {
            ...user,
            cluster_count: clusterCount || 0,
            task_count: taskCount || 0
          };
        })
      );

      setUsers(usersWithClusterCount);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAuditLogs() {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setAuditLogs(data);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  }

  async function updateUserRole(userId, newRole) {
    setUpdatingRole(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Log the action
      await logAudit('role_change', userId, { old_role: users.find(u => u.id === userId)?.role, new_role: newRole });
      
      fetchUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setUpdatingRole(false);
      setEditingUser(null);
    }
  }

  async function suspendUser(userId, isSuspended) {
    try {
      const newRole = isSuspended ? 'suspended' : 'user';
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, suspended_at: isSuspended ? new Date().toISOString() : null })
        .eq('id', userId);

      if (error) throw error;

      await logAudit(isSuspended ? 'user_suspended' : 'user_activated', userId, {});
      fetchUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  async function deleteUser(userId) {
    try {
      // Delete from user_clusters first
      await supabase.from('user_clusters').delete().eq('user_id', userId);
      
      // Delete from tasks
      await supabase.from('tasks').delete().eq('user_id', userId);
      
      // Delete from users
      const { error } = await supabase.from('users').delete().eq('id', userId);
      
      if (error) throw error;

      await logAudit('user_deleted', userId, {});
      fetchUsers();
      setSelectedUser(null);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async function logAudit(action, userId, metadata) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: action,
        target_user_id: userId,
        metadata: metadata,
        ip_address: 'admin_action'
      });
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'leader': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'suspended': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    leaders: users.filter(u => u.role === 'leader').length,
    users: users.filter(u => u.role === 'user').length,
    suspended: users.filter(u => u.role === 'suspended').length,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-[var(--text-primary)] text-sm">Manage users, roles, and permissions across the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Total Users</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-red-400">{stats.admins}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Admins</div>
          </div>
          {/* <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{stats.leaders}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Leaders</div>
          </div> */}
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-cyan-400">{stats.users}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Regular Users</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-gray-400">{stats.suspended}</div>
            <div className="text-xs text-[var(--text-primary)]/60">Suspended</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-lg">search</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            {/* <option value="leader">Leader</option> */}
            <option value="user">User</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition"
          >
            Refresh
          </button>
        </div>

        {/* Users Table */}
        <div className={`transition-all duration-300 ${selectedUser ? 'lg:pr-96' : ''}`}>
          <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-sm text-[var(--text-primary)] mt-4">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">USER</th>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">EMAIL</th>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">PHONE</th>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">ROLE</th>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">STATS</th>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">JOINED</th>
                      <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                              <span className="text-sm">{user.name?.[0] || '👤'}</span>
                            </div>
                            <span className="font-medium text-white">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--text-primary)]">{user.email}</td>
                        <td className="p-4 text-[var(--text-primary)]">{user.phone || '—'}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 text-xs">
                            <span className="text-cyan-400">📋 {user.task_count || 0}</span>
                            <span className="text-purple-400">👥 {user.cluster_count || 0}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--text-primary)] text-xs">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-primary)] hover:text-cyan-400 transition"
                              title="Edit Role"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-primary)] hover:text-red-400 transition"
                              title="Delete User"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/10 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-white/5 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-[var(--text-primary)]">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-white/5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Detail Panel - Slide Out */}
        {selectedUser && (
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[var(--surface)] border-l border-white/10 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
            <div className="sticky top-0 bg-[var(--surface)] p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              {/* User Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-2xl">
                  {selectedUser.name?.[0] || '👤'}
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-[var(--text-primary)]">{selectedUser.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{selectedUser.task_count || 0}</div>
                  <div className="text-xs text-[var(--text-primary)]/60">Tasks Created</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-purple-400">{selectedUser.cluster_count || 0}</div>
                  <div className="text-xs text-[var(--text-primary)]/60">Clusters Joined</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{selectedUser.total_xp || 0}</div>
                  <div className="text-xs text-[var(--text-primary)]/60">Total XP</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{selectedUser.nebula_coins || 0}</div>
                  <div className="text-xs text-[var(--text-primary)]/60">Nebula Coins</div>
                </div>
              </div>

              {/* Role Management */}
              <div className="mb-6">
                <label className="block text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60 mb-2">ROLE</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => updateUserRole(selectedUser.id, e.target.value)}
                  disabled={updatingRole}
                  className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="user">User</option>
                  {/* <option value="leader">Leader</option> */}
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Account Status */}
              <div className="mb-6">
                <label className="block text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60 mb-2">ACCOUNT STATUS</label>
                <div className="flex gap-3">
                  {selectedUser.role !== 'suspended' ? (
                    <button
                      onClick={() => suspendUser(selectedUser.id, true)}
                      className="flex-1 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition"
                    >
                      Suspend Account
                    </button>
                  ) : (
                    <button
                      onClick={() => suspendUser(selectedUser.id, false)}
                      className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                    >
                      Activate Account
                    </button>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3 mb-6 p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-xs text-[var(--text-primary)]/50">Phone Number</p>
                  <p className="text-sm text-white">{selectedUser.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-primary)]/50">User ID</p>
                  <p className="text-xs font-['JetBrains_Mono'] text-[var(--text-primary)] break-all">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-primary)]/50">Joined</p>
                  <p className="text-sm text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-500/30 rounded-xl p-4">
                <h4 className="text-sm font-bold text-red-400 mb-3">Danger Zone</h4>
                <button
                  onClick={() => {
                    setUserToDelete(selectedUser);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                >
                  Delete User Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md border border-white/10">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Change Role</h3>
                <p className="text-xs text-[var(--text-primary)] mt-1">{editingUser.name}</p>
              </div>
              <div className="p-5">
                <select
                  id="roleSelect"
                  defaultValue={editingUser.role}
                  className="w-full px-4 py-2 bg-[var(--surface-low)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="user">User</option>
                  {/* <option value="leader">Leader</option> */}
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="p-5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newRole = document.getElementById('roleSelect').value;
                    updateUserRole(editingUser.id, newRole);
                  }}
                  className="flex-1 px-4 py-2 button-gradient rounded-lg text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && userToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] rounded-2xl w-full max-w-md border border-red-500/30">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-red-400">⚠️ Delete User</h3>
              </div>
              <div className="p-5">
                <p className="text-white mb-2">Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
                <p className="text-xs text-[var(--text-primary)]/70">This action cannot be undone. All associated tasks, clusters, and data will be permanently removed.</p>
              </div>
              <div className="p-5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteUser(userToDelete.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}