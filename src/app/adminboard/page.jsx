'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminBoardPage() {
  const [admin, setAdmin] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(session);
    // Security redirect intercept: Banish non-admin profiles to the standard dashboard
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setAdmin(parsedUser);

    // Pull the entire master roster directory straight out of Supabase
    const fetchMasterRoster = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsersList(data || []);
      } catch (err) {
        console.error("Error connecting to database core system logs:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterRoster();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('nebula_session');
    router.push('/login');
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 text-white font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Admin Header Board Node */}
        <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-['JetBrains_Mono'] text-red-400 uppercase tracking-widest block mb-1">
              Root System Clearance Access Verified
            </span>
            <h1 className="text-2xl font-bold font-['Space_Grotesk']">Central Operations Mainframe</h1>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-red-500/20 text-red-300 transition-all">
            Disconnect Mainframe
          </button>
        </div>

        {/* Master Users Table Matrix */}
        <div className="p-6 rounded-2xl bg-[#131315]/40 border border-white/10 backdrop-blur-md space-y-4">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pink-400">Active Grid Identity Registry</h3>
            <span className="text-xs font-['JetBrains_Mono'] text-gray-500">Node Population: {usersList.length}</span>
          </div>

          {loading ? (
            <p className="text-xs font-['JetBrains_Mono'] text-gray-400 animate-pulse py-4">Pinging network data cells...</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {usersList.map(u => (
                <div key={u.id} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl flex justify-between items-center text-sm transition-colors border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="font-bold text-white tracking-tight">{u.name}</span>
                    <span className="text-xs text-gray-400 font-['JetBrains_Mono']">{u.email}</span>
                    <span className="text-xs text-gray-500 font-['JetBrains_Mono']">{u.phone}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-['JetBrains_Mono'] uppercase ${
                    u.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    u.role === 'leader' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 
                    'bg-gray-500/20 text-gray-300 border border-white/5'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}