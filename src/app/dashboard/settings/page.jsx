'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', email: '' });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('nebula_session'));
    if (session) {
      setUser(session);
      setFormData({ name: session.name || '', bio: session.bio || '', email: session.email || '' });
    }
    setLoading(false);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('users')
      .update({ name: formData.name, bio: formData.bio })
      .eq('id', user.id);

    if (error) {
      alert("Update Failed: " + error.message);
    } else {
      alert("Identity matrix updated successfully.");
      // Sync local session
      const updatedUser = { ...user, name: formData.name, bio: formData.bio };
      localStorage.setItem('nebula_session', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-cyan-400 p-8 font-mono">INITIALIZING SETTINGS NODE...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 text-white font-['Inter']">
      <h1 className="text-3xl font-bold mb-6 font-['Space_Grotesk'] text-[#dae2fd]">User Configuration</h1>
      
      <form onSubmit={handleUpdate} className="bg-[#131315]/60 border border-white/10 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Display Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Bio / Operational Note</label>
          <textarea 
            value={formData.bio} 
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none transition h-24"
          />
        </div>

        <div className="pt-6 border-t border-white/5">
          <button 
            disabled={saving}
            type="submit"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-sm font-bold rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Apply Changes'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 p-4 border border-red-900/30 bg-red-900/10 rounded-xl">
        <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
        <button 
          onClick={() => { if(confirm("Are you sure?")) supabase.auth.signOut(); }}
          className="text-xs text-red-400 hover:text-red-300 underline"
        >
          Sign Out of System Matrix
        </button>
      </div>
    </div>
  );
}