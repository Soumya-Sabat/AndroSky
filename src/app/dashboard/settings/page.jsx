'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    bio: '', 
    phone_number: '', 
    links: '',
    email: ''
  });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('nebula_session'));
    if (!session?.id) {
      router.push('/login');
      return;
    }
    fetchFreshUserData(session.id);
  }, [router]);

  async function fetchFreshUserData(userId) {
    setLoading(true);
    // Fetch directly from DB to get latest schema columns
    const { data, error } = await supabase
      .from('users')
      .select('name, bio, phone_number, links, email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Fetch Error:", error);
    } else if (data) {
      setFormData({ 
        name: data.name || '', 
        bio: data.bio || '', 
        phone_number: data.phone_number || '',
        links: Array.isArray(data.links) ? data.links.join(', ') : '',
        email: data.email || ''
      });
    }
    setLoading(false);
  }
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const session = JSON.parse(localStorage.getItem('nebula_session'));
    const linksArray = formData.links.split(',').map(l => l.trim()).filter(l => l);

    const { error } = await supabase
      .from('users')
      .update({ 
        name: formData.name, 
        bio: formData.bio,
        phone_number: formData.phone_number,
        links: linksArray
      })
      .eq('id', session.id);

    if (error) {
      alert("Update Failed: " + error.message);
    } else {
      alert("Settings synchronized.");
      // Refresh local session storage
      localStorage.setItem('nebula_session', JSON.stringify({ ...session, ...formData }));
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-cyan-400 font-mono">LOADING CONFIGURATION...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 text-white font-['Inter']">
      <h1 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-[#dae2fd]">Operational Settings</h1>
      
      <form onSubmit={handleUpdate} className="bg-[#131315]/60 border border-white/10 rounded-2xl p-8 space-y-6">
        
        {/* Read-Only Identity Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">System Email</label>
            <input disabled value={formData.email} className="w-full bg-black/20 border border-white/5 rounded-lg p-3 text-s text-cyan-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Phone Number</label>
            <input 
              disabled
              value={formData.phone} 
              
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none transition" 
            />
          </div>
        </div>

        {/* Editable Section */}
        <div>
          <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Display Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none transition" />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Bio</label>
          <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none transition h-24" />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Portfolio Links (Comma Separated)</label>
          <input type="text" value={formData.links} onChange={(e) => setFormData({...formData, links: e.target.value})} placeholder="https://github.com, https://linkedin.com" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 outline-none transition" />
        </div>

        <button disabled={saving} type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-sm font-bold rounded-lg transition uppercase tracking-widest">
          {saving ? 'Syncing...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}