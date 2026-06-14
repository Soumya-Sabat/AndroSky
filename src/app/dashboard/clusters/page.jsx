'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ClusterPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [currentCluster, setCurrentCluster] = useState(null);
  const [clusterMembers, setClusterMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Forms Functional State Variables
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [clusterName, setClusterName] = useState('');
  const [clusterDesc, setClusterDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Helper: Clear validation notices safely
  const triggerFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 6000);
  };

  // Generate a cryptographically distinct 5-Character Room Entry Code Vector
  const generateClusterCode = () => {
    const matrixChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous lookalikes (0, 1, I, O)
    let dynamicToken = "";
    for (let i = 0; i < 5; i++) {
      dynamicToken += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
    }
    return dynamicToken;
  };

  // Synchronize room telemetry and current allocations
  const fetchClusterTelemetry = useCallback(async (clusterId) => {
    try {
      const { data: clusterData, error: clusterErr } = await supabase
        .from('clusters')
        .select('*')
        .eq('id', clusterId)
        .single();

      if (clusterErr) throw clusterErr;
      setCurrentCluster(clusterData);

      // Fetch active registered nodes residing inside this room context right now
      const { data: members, error: membersErr } = await supabase
        .from('users')
        .select('id, name, total_xp, current_level')
        .eq('current_cluster_id', clusterId)
        .order('total_xp', { ascending: false });

      if (!membersErr && members) {
        setClusterMembers(members);
      }
    } catch (err) {
      console.error("Telemetry node allocation fault:", err);
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) return router.push('/login');

    const parsedUser = JSON.parse(session);
    setUser(parsedUser);

    if (parsedUser.current_cluster_id) {
      fetchClusterTelemetry(parsedUser.current_cluster_id);
    }
    setLoading(false);
  }, [router, fetchClusterTelemetry]);

// 1. Core Action Handler: Initialize & Deploy a brand new cluster workspace channel
const handleCreateCluster = async (e) => {
  e.preventDefault();
  if (!clusterName.trim() || !user) return;
  setActionLoading(true);

  const generatedCode = generateClusterCode();

  try {
    // Calling our administrative RPC to bypass client token drops securely
    const { data: clusterRow, error: rpcErr } = await supabase
      .rpc('initialize_custom_cluster', {
        p_name: clusterName.trim(),
        p_description: clusterDesc.trim() || null,
        p_access_code: generatedCode,
        p_creator_id: user.id
      })
      .single();

    if (rpcErr) throw rpcErr;
    if (!clusterRow) throw new Error("Database returned an empty dataset map.");

    // Update Local runtime session data structures
    const synchronizedUser = { ...user, current_cluster_id: clusterRow.id };
    setUser(synchronizedUser);
    localStorage.setItem('nebula_session', JSON.stringify(synchronizedUser));

    await fetchClusterTelemetry(clusterRow.id);
    setShowCreateForm(false);
    setClusterName('');
    setClusterDesc('');
    triggerFeedback('success', `Cluster Node Initialized successfully. Channel Code: ${generatedCode}`);
  } catch (err) {
    triggerFeedback('error', `Deployment Initialization Error: ${err.message}`);
  } finally {
    setActionLoading(false);
  }
};

  // 2. Core Action Handler: Verify constraints, clear ceiling, and connect to code coordinate
  const handleJoinCluster = async (e) => {
    e.preventDefault();
    const formattedCode = joinCode.trim().toUpperCase();
    if (formattedCode.length !== 5 || !user) {
      triggerFeedback('error', 'Validation Fault: Cluster Access Key must be exactly 5 alphanumeric digits.');
      return;
    }
    setActionLoading(true);

    try {
      // Step A: Trace target code matrix inside reference table
      const { data: targetCluster, error: lookupErr } = await supabase
        .from('clusters')
        .select('*')
        .eq('access_code', formattedCode)
        .maybeSingle();

      if (lookupErr) throw lookupErr;
      if (!targetCluster) {
        triggerFeedback('error', 'Authentication Failure: The access signature entered does not match any online node cluster.');
        setActionLoading(false);
        return;
      }

      // Step B: Evaluate absolute headcount constraint criteria checks (Maximum 30 members)
      const { count, error: countErr } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('current_cluster_id', targetCluster.id);

      if (countErr) throw countErr;
      if (count && count >= 30) {
        triggerFeedback('error', 'Capacity Reached: This cluster deployment sector is capped at its maximum limit of 30 active units.');
        setActionLoading(false);
        return;
      }

      // Step C: Execute workspace relocation entry map switch
      const { error: mergeErr } = await supabase
        .from('users')
        .update({ current_cluster_id: targetCluster.id })
        .eq('id', user.id);

      if (mergeErr) throw mergeErr;

      // Complete session update loops
      const synchronizedUser = { ...user, current_cluster_id: targetCluster.id };
      setUser(synchronizedUser);
      localStorage.setItem('nebula_session', JSON.stringify(synchronizedUser));

      await fetchClusterTelemetry(targetCluster.id);
      setShowJoinForm(false);
      setJoinCode('');
      triggerFeedback('success', `Linked successfully. Welcome to ${targetCluster.name}.`);
    } catch (err) {
      triggerFeedback('error', `Grid Union Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Action Handler: Disconnect and unlink from room workspace arrays completely
  const handleLeaveCluster = async () => {
    if (!confirm("Are you sure you want to disconnect your user profile vector from this cluster coordinate system? All shared workspace layouts will unmount.")) return;
    setActionLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ current_cluster_id: null })
        .eq('id', user.id);

      if (error) throw error;

      const synchronizedUser = { ...user, current_cluster_id: null };
      setUser(synchronizedUser);
      localStorage.setItem('nebula_session', JSON.stringify(synchronizedUser));

      setCurrentCluster(null);
      setClusterMembers([]);
      triggerFeedback('success', 'Profile decoupled. Workspace reset to isolated standalone terminal layout.');
    } catch (err) {
      triggerFeedback('error', `Decoupling Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter'] text-white max-w-4xl mx-auto p-2">
      
      {/* Alert Messaging System Banner */}
      {feedback.text && (
        <div className={`p-4 rounded-xl text-xs font-['JetBrains_Mono'] border transition-all animate-fadeIn ${
          feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {feedback.type === 'success' ? '✓ SYSTEM STATE:' : '⚠️ TELEMETRY WARN:'} {feedback.text}
        </div>
      )}

      {/* Main Context Dynamic Render Switching Floor */}
      {!currentCluster ? (
        <div className="p-8 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold">Cosmic Clusters Workspace</h1>
            <p className="text-gray-400 text-sm">You are currently operating in a standalone terminal mode. Connect to a multi-agent cluster network quadrant to synchronize tasks lists logs.</p>
          </div>

          {/* Core Selection Button Anchors */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
            <button 
              onClick={() => { setShowCreateForm(true); setShowJoinForm(false); }}
              className="flex-1 py-3 px-5 button-gradient rounded-xl font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider transition-transform hover:scale-[1.02]"
            >
              🚀 Initialize New Sector
            </button>
            <button 
              onClick={() => { setShowJoinForm(true); setShowCreateForm(false); }}
              className="flex-1 py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              📡 Link Existing Code
            </button>
          </div>

          {/* Form Node Block A: Create Room */}
          {showCreateForm && (
            <form onSubmit={handleCreateCluster} className="max-w-md mx-auto text-left p-5 bg-black/30 border border-white/5 rounded-2xl space-y-4 animate-fadeIn">
              <h3 className="text-xs font-['JetBrains_Mono'] text-cyan-400 uppercase tracking-widest font-bold">Configure New Matrix Node Channel</h3>
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Sector Name *</label>
                <input required type="text" placeholder="e.g. RoboKranti Core Labs" className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-400" value={clusterName} onChange={e => setClusterName(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Operational Directives Summary (Optional)</label>
                <textarea rows="2" placeholder="Brief context mapping description logs..." className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none resize-none" value={clusterDesc} onChange={e => setClusterDesc(e.target.value)} />
              </div>
              <button disabled={actionLoading} type="submit" className="w-full py-2 bg-cyan-500 text-black text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wider rounded-xl disabled:opacity-40">
                {actionLoading ? 'Provisioning Sector...' : 'Execute Genesis Deployment'}
              </button>
            </form>
          )}

          {/* Form Node Block B: Join Room */}
          {showJoinForm && (
            <form onSubmit={handleJoinCluster} className="max-w-sm mx-auto text-left p-5 bg-black/30 border border-white/5 rounded-2xl space-y-4 animate-fadeIn">
              <h3 className="text-xs font-['JetBrains_Mono'] text-purple-400 uppercase tracking-widest font-bold">Establish Connection Link Alignment</h3>
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">Input 5-Digit Access Code Signature</label>
                <input 
                  required 
                  type="text" 
                  maxLength={5} 
                  placeholder="e.g. XJ49F" 
                  className="w-full p-3 bg-[#1b1b1f] border border-white/10 rounded-xl text-center text-sm uppercase font-['JetBrains_Mono'] tracking-widest font-bold text-cyan-300 focus:outline-none focus:border-purple-400" 
                  value={joinCode} 
                  onChange={e => setJoinCode(e.target.value)} 
                />
              </div>
              <button disabled={actionLoading} type="submit" className="w-full py-2 bg-purple-500 text-white text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wider rounded-xl disabled:opacity-40">
                {actionLoading ? 'Verifying Protocols...' : 'Sync Context Alignment'}
              </button>
            </form>
          )}
        </div>
      ) : (
        // 🔮 ACTIVE CLUSTER DASHBOARD OVERVIEW PANEL HUB
        <div className="space-y-6">
          {/* Active Sector Header Block */}
          <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 uppercase font-bold tracking-widest">Connected Quadrant Network Node</span>
              <h1 className="font-['Space_Grotesk'] text-2xl font-bold mt-1 text-[#dae2fd]">{currentCluster.name}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{currentCluster.description || 'No supplemental description documentation appended to this cluster station registry.'}</p>
            </div>
            
            <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-center min-w-[120px]">
              <span className="text-[9px] font-['JetBrains_Mono'] text-gray-500 uppercase block">Access Key Code</span>
              <span className="text-xl font-['JetBrains_Mono'] font-bold tracking-widest text-cyan-400">{currentCluster.access_code}</span>
            </div>
          </div>

          {/* Operational Metrics Display Matrix Grid Row Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Manifest Members List Column Container */}
            <div className="bg-[#131315]/60 border border-white/10 p-5 rounded-2xl space-y-4 md:col-span-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider">Operational Unit Manifest</h3>
                <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 bg-white/5 rounded text-gray-400 font-bold">
                  👤 {clusterMembers.length} / 30 Capacity Ceiling
                </span>
              </div>

              <div className="divide-y divide-white/5 max-h-[350px] overflow-y-auto pr-1">
                {clusterMembers.map((member, idx) => (
                  <div key={member.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-600 text-[10px]">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-gray-200">{member.name} {member.id === user.id && <span className="text-[9px] text-cyan-400">(You)</span>}</p>
                        <p className="text-[10px] font-mono text-gray-500">Tier Index Rating Level {member.current_level || 1}</p>
                      </div>
                    </div>
                    <span className="text-purple-400 font-['JetBrains_Mono'] font-bold">{member.total_xp || 0} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Station Options Utility Command Grid Desk Area */}
            <div className="bg-[#131315]/60 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-purple-300">Station Terminal Controls</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Task configurations deployed in the professional workspace column view are automatically shared across all logged unit instances in this array list container manifest module.</p>
              </div>

              <button 
                disabled={actionLoading}
                onClick={handleLeaveCluster}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-['JetBrains_Mono'] uppercase tracking-wider font-bold transition-colors disabled:opacity-40"
              >
                {actionLoading ? 'Processing Severance...' : '❌ Decouple From Cluster'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}