'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ClusterSelectionHub() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [joinedClusters, setJoinedClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Form Field inputs
  const [clusterName, setClusterName] = useState('');
  const [clusterDesc, setClusterDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const triggerFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 5000);
  };

  const generateClusterCode = () => {
    const matrix = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 5 }, () => matrix.charAt(Math.floor(Math.random() * matrix.length))).join('');
  };

  const fetchUserClusterFleet = useCallback(async (userId) => {
    try {
      const { data: memberships, error } = await supabase
        .from('cluster_memberships')
        .select(`
          cluster_id,
          clusters:cluster_id ( id, name, access_code, description, created_at )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      if (memberships) {
        setJoinedClusters(memberships.map(m => m.clusters).filter(Boolean));
      }
    } catch (err) {
      console.error("Fleet indexing failure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) return router.push('/login');

    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    fetchUserClusterFleet(parsedUser.id);
  }, [router, fetchUserClusterFleet]);

  const handleCreateCluster = async (e) => {
    e.preventDefault();
    if (!clusterName.trim() || !user) return;
    setActionLoading(true);
    const code = generateClusterCode();

    try {
      const { data: clusterRow, error } = await supabase
        .rpc('initialize_custom_cluster', {
          p_name: clusterName.trim(),
          p_description: clusterDesc.trim() || null,
          p_access_code: code,
          p_creator_id: user.id
        }).single();

      if (error) throw error;

      // Update local storage focus state instantly
      const updatedUser = { ...user, current_cluster_id: clusterRow.id };
      localStorage.setItem('nebula_session', JSON.stringify(updatedUser));

      setClusterName('');
      setClusterDesc('');
      setShowCreateModal(false);
      triggerFeedback('success', `Cluster Node Initialized successfully.`);
      
      // Force reload list and take them directly into their newly created cluster deck!
      router.push(`/dashboard/cluster/${clusterRow.id}`);
    } catch (err) {
      triggerFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinCluster = async (e) => {
    e.preventDefault();
    const formattedCode = joinCode.trim().toUpperCase();
    if (formattedCode.length !== 5 || !user) return;
    setActionLoading(true);

    try {
      const { data: targetCluster } = await supabase.from('clusters').select('*').eq('access_code', formattedCode).maybeSingle();
      if (!targetCluster) {
        triggerFeedback('error', 'Authentication Failure: Code does not match any online cluster.');
        setActionLoading(false);
        return;
      }

      const { count } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('current_cluster_id', targetCluster.id);
      if (count && count >= 30) {
        triggerFeedback('error', 'Capacity Fault: Target cluster sector is capped at 30 members maximum.');
        setActionLoading(false);
        return;
      }
      //  CORRECT NATIVE METHOD:
      await supabase.from('cluster_memberships').upsert(
        { cluster_id: targetCluster.id, user_id: user.id },
        { onConflict: 'cluster_id, user_id' }
      );
      // await supabase.from('cluster_memberships').insert([{ cluster_id: targetCluster.id, user_id: user.id }]).onConflict('DO NOTHING');
      await supabase.from('users').update({ current_cluster_id: targetCluster.id }).eq('id', user.id);

      const updatedUser = { ...user, current_cluster_id: targetCluster.id };
      localStorage.setItem('nebula_session', JSON.stringify(updatedUser));

      setJoinCode('');
      setShowJoinModal(false);
      
      // Directly drop them inside the newly joined space
      router.push(`/dashboard/cluster/${targetCluster.id}`);
    } catch (err) {
      triggerFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs font-mono text-cyan-400 animate-pulse">SYNCHRONIZING FLEET DIRECTORY LAYOUT...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 text-white font-['Inter']">
      
      {/* Feedback notice alerts */}
      {feedback.text && (
        <div className={`p-4 rounded-xl text-xs font-mono border transition-all ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          ⚙️ {feedback.text}
        </div>
      )}

      {/* Header Deck Branding Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight">Cluster Command Station</h1>
          <p className="text-sm text-gray-400 mt-1">Select an active grid matrix channel below to connect interface telemetry or launch a fresh sector alignment.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setShowJoinModal(true)} className="flex-1 md:flex-none py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono text-xs font-bold uppercase tracking-wider">📡 Sync Code</button>
          <button onClick={() => setShowCreateModal(true)} className="flex-1 md:flex-none py-2 px-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-mono text-xs font-bold uppercase rounded-xl tracking-wider hover:opacity-90">🚀 New Sector</button>
        </div>
      </div>

      {/* Interactive Card Grids Deck View Layout */}
      {joinedClusters.length === 0 ? (
        <div className="text-center py-20 bg-[#131315]/20 border border-dashed border-white/10 rounded-3xl p-8 space-y-3">
          <p className="text-sm font-mono text-gray-500">Your core account profile node is not linked to any operational workspace channels.</p>
          <p className="text-xs text-gray-600">Deploy a new channel coordinate block above or request access codes from your coordinator fleet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
          {joinedClusters.map((cluster) => (
            <div 
              key={cluster.id} 
              onClick={() => router.push(`/dashboard/cluster/${cluster.id}`)}
              className="group relative p-6 rounded-2xl bg-[#131315]/50 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[180px] shadow-lg backdrop-blur-md"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-gray-200 group-hover:text-cyan-400 transition-colors line-clamp-1">{cluster.name}</h3>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0 uppercase">
                    {cluster.access_code}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {cluster.description || 'No complementary directives or operational roadmap details summarized for this node branch.'}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span>DEPLOYED: {new Date(cluster.created_at).toLocaleDateString()}</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform uppercase font-bold tracking-wider">Connect Deck ➜</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ➕ MODAL FORM DECK: CREATE NEW SECTOR */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-white/10 p-6 rounded-3xl max-w-md w-full relative space-y-4 shadow-2xl">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono text-xs">✕ Close</button>
            <form onSubmit={handleCreateCluster} className="space-y-4 pt-2">
              <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider font-bold">Initialize Node Sector</h3>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Sector Name *</label>
                <input required type="text" placeholder="e.g. XYZ Quadrant" className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-400 text-white" value={clusterName} onChange={e => setClusterName(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Directives Metadata Abstract Summary</label>
                <textarea rows="3" placeholder="Briefly inventory operational workspace targets logs..." className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-400 text-white resize-none" value={clusterDesc} onChange={e => setClusterDesc(e.target.value)} />
              </div>
              <button disabled={actionLoading} type="submit" className="w-full py-2.5 bg-cyan-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-opacity">{actionLoading ? 'COMPILING SCHEMAS...' : 'EXECUTE SECTOR INITIALIZATION'}</button>
            </form>
          </div>
        </div>
      )}

      {/* 📡 MODAL FORM DECK: JOIN SYSTEM WITH ACCESS TOKEN */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-white/10 p-6 rounded-3xl max-w-xs w-full relative space-y-4 shadow-2xl">
            <button onClick={() => setShowJoinModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono text-xs">✕ Close</button>
            <form onSubmit={handleJoinCluster} className="space-y-4 pt-2">
              <h3 className="text-sm font-mono text-purple-400 uppercase tracking-wider font-bold">Establish Terminal Pipeline</h3>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Input 5-Digit Alignment Key</label>
                <input required type="text" maxLength={5} placeholder="Enter the code..." className="w-full p-3 bg-[#1b1b1f] border border-white/10 rounded-xl text-center text-sm font-mono tracking-widest font-bold text-cyan-200 focus:outline-none focus:border-purple-400" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
              </div>
              <button disabled={actionLoading} type="submit" className="w-full py-2.5 bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl">{actionLoading ? 'CONNECTING GRID...' : 'LINK SYSTEM INTERLOCK'}</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}