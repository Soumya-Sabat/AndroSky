'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [clusterName, setClusterName] = useState('');
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(session);
    // Security redirect intercept: Banish Admin connections away to their specific command deck
    if (parsedUser.role === 'admin') {
      router.push('/adminboard');
    } else {
      setUser(parsedUser);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('nebula_session');
    router.push('/login');
  };

  const handleCreateCluster = async (e) => {
    e.preventDefault();
    if (!clusterName.trim()) return;

    try {
      const generatedCode = 'NT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ role: 'leader' })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(updatedUser);
      localStorage.setItem('nebula_session', JSON.stringify(updatedUser));
      setFeedback(`✨ Cluster "${clusterName}" deployed! Code: ${generatedCode}. Clearance upgraded to Leader.`);
      setClusterName('');
    } catch (err) {
      setFeedback(`❌ System Error updating role parameters: ${err.message}`);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 text-white font-['Inter']">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-['JetBrains_Mono'] text-cyan-400 uppercase tracking-widest block mb-1">
              Clearance Level {user.current_level} • {user.role}
            </span>
            <h1 className="text-2xl font-bold font-['Space_Grotesk']">System Dashboard: {user.name}</h1>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-red-500/20 text-red-300 transition-all">
            Disconnect Terminal
          </button>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-['JetBrains_Mono']">
            {feedback}
          </div>
        )}

        <div className="p-6 rounded-2xl bg-[#131315]/40 border border-white/10 backdrop-blur-md max-w-md">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-purple-400 mb-2">Squadron Deployment</h3>
          {user.role === 'user' ? (
            <form onSubmit={handleCreateCluster} className="space-y-3">
              <p className="text-xs text-gray-400">Deploy your own node. Submitting coordinates upgrades your status parameters to Leader.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Designate Cluster Name" required className="flex-grow p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white" value={clusterName} onChange={e => setClusterName(e.target.value)} />
                <button type="submit" className="px-4 button-gradient rounded-xl font-bold text-xs uppercase tracking-wide whitespace-nowrap">Build Core</button>
              </div>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              🚀 <strong>Leader Capabilities Confirmed:</strong> You have active squadron privileges.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}