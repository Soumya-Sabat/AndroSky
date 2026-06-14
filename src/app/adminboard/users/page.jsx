'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

//   async function fetchUsers() {
//     const { data } = await supabase.from('users').select('*');
//     setUsers(data || []);
//   }
        async function fetchUsers() {
        const { data } = await supabase
            .from('users')
            .select(`
            *,
            cluster_memberships(count)
            `);
        
        // Flatten the count for easy display
        const formattedUsers = data.map(u => ({
            ...u,
            cluster_count: u.cluster_memberships[0]?.count || 0
        }));
        setUsers(formattedUsers);
        }

  async function deleteUser(id) {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    // Note: Deleting from 'users' table. 
    // If you have Auth users, you must also delete from auth.users via an Edge Function.
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
    setSelectedUser(null);
  }

  return (
    <div className="p-8 text-white flex gap-6">
      {/* User Table */}
      <div className={`flex-1 transition-all ${selectedUser ? 'w-2/3' : 'w-full'}`}>
        <h1 className="text-3xl font-bold mb-8">User Directory</h1>
        <div className="bg-[#131315] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/20 text-gray-400 uppercase text-[10px]">
              <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-white/5 cursor-pointer hover:bg-white/5" onClick={() => setSelectedUser(u)}>
                  <td className="p-4">{u.name}</td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4 text-cyan-400">View Details</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Panel */}
      {selectedUser && (
        <div className="w-1/3 bg-[#131315] border-l border-white/10 p-6 h-screen sticky top-0">
          <button onClick={() => setSelectedUser(null)} className="mb-6 text-gray-500">← Close</button>
          <h2 className="text-xl font-bold mb-4">{selectedUser.name}</h2>
          <p className="text-sm text-gray-400 mb-6">{selectedUser.email}</p>
          
          <div className="bg-black/40 p-4 rounded-xl mb-6">
            <p className="text-[10px] text-purple-400 uppercase tracking-widest">Cluster Groups</p>
            <h3 className="text-2xl font-bold mt-1">
               {/* Assuming a 'cluster_memberships' table exists */}
               {selectedUser.cluster_count || 0}
            </h3>
          </div>

          <button 
            onClick={() => deleteUser(selectedUser.id)}
            className="w-full py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl hover:bg-red-900/40"
          >
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}