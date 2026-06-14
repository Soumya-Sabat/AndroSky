'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WorkspaceClusterNode() {
  const router = useRouter();
  const params = useParams();
  const clusterId = params.id; // Extracts room ID directly from URL coordinate path maps
  
  const [user, setUser] = useState(null);
  const [currentCluster, setCurrentCluster] = useState(null);
  const [clusterMembers, setClusterMembers] = useState([]);
  const [clusterLogs, setClusterLogs] = useState([]);
  const [clusterTasks, setClusterTasks] = useState([]);
  
  // Controls Layout State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'logs' | 'manifest'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Task parameters input
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState(3);
  const [tagInputValue, setTagInputValue] = useState('');

  // Administrative Authority Flag Checklist
  const isGroupCreator = user && currentCluster && user.id === currentCluster.creator_id;

  const triggerFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 5000);
  };

  const synchronizeSectorData = useCallback(async () => {
    if (!clusterId) return;
    try {
      // 1. Load Cluster Meta
      const { data: cluster, error: errC } = await supabase.from('clusters').select('*').eq('id', clusterId).maybeSingle();
      if (errC || !cluster) {
        console.error("Cluster lookup missing or unauthorized access matrix layout context.");
        router.push('/dashboard/cluster');
        return;
      }
      setCurrentCluster(cluster);

      // 2. Fetch Active Profile Units Inside This Segment Room Context
      const { data: members } = await supabase
        .from('users')
        .select('id, name, email, total_xp, current_level')
        .eq('current_cluster_id', clusterId);
      if (members) setClusterMembers(members);

      // 3. Extract Operations Timeline Logs History
      const { data: logs } = await supabase
        .from('cluster_logs')
        .select('*')
        .eq('cluster_id', clusterId)
        .order('created_at', { ascending: false });
      if (logs) setClusterLogs(logs);

      // 4. Fetch Tasks Matrices
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('cluster_id', clusterId)
        .order('priority', { ascending: true });
      if (tasks) setClusterTasks(tasks);

    } catch (err) {
      console.error("Critical channel pipeline processing fault sync telemetry:", err);
    } finally {
      setLoading(false);
    }
  }, [clusterId, router]);

  const appendAuditTrail = async (actionType, textDescription) => {
    if (!user || !clusterId) return;
    await supabase.from('cluster_logs').insert([{
      cluster_id: clusterId,
      actor_id: user.id,
      actor_name: user.name || user.email.split('@')[0],
      action_type: actionType,
      description: textDescription
    }]);
  };

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) return router.push('/login');

    const parsedUser = JSON.parse(session);
    setUser(parsedUser);

    // Sync active workspace pointer field variables natively in background row tables
    if (parsedUser.current_cluster_id !== clusterId) {
      supabase.from('users').update({ current_cluster_id: clusterId }).eq('id', parsedUser.id).then(() => {
        const synchedUserObj = { ...parsedUser, current_cluster_id: clusterId };
        localStorage.setItem('nebula_session', JSON.stringify(synchedUserObj));
      });
    }

    synchronizeSectorData();
  }, [clusterId, router, synchronizeSectorData]);

  const handleCreateClusterTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !currentCluster) return;
    setActionLoading(true);

    let finalTagsArray = [];
    let targetedToAll = false;

    const parseInputTokens = tagInputValue.split(',').map(t => t.trim());

    if (parseInputTokens.some(token => token.toLowerCase() === '@all')) {
      targetedToAll = true;
      finalTagsArray = clusterMembers.map(m => ({ id: m.id, name: m.name || m.email.split('@')[0] }));
    } else {
      parseInputTokens.forEach(token => {
        const cleanToken = token.replace('@', '').toLowerCase();
        const foundMember = clusterMembers.find(m => 
          m.name?.toLowerCase() === cleanToken || 
          m.email?.toLowerCase().split('@')[0] === cleanToken
        );
        if (foundMember) {
          finalTagsArray.push({ id: foundMember.id, name: foundMember.name || foundMember.email.split('@')[0] });
        }
      });
    }

    try {
      const { error } = await supabase.from('tasks').insert([{
        cluster_id: clusterId,
        user_id: user.id,
        title: taskTitle.trim(),
        description: taskDesc.trim() || null,
        priority: parseInt(taskPriority),
        status: 'todo',
        is_assigned_to_all: targetedToAll,
        assigned_tags: JSON.stringify(finalTagsArray)
      }]);

      if (error) throw error;

      const auditLogMsg = targetedToAll 
        ? `Dispatched board task block [${taskTitle}] targeting @all units.`
        : `Dispatched localized task block [${taskTitle}] assigned to: ${finalTagsArray.map(f => f.name).join(', ') || 'Independent Core'}`;

      await appendAuditTrail('TASK_CREATE', auditLogMsg);
      await synchronizeSectorData();
      
      setTaskTitle('');
      setTaskDesc('');
      setTagInputValue('');
      setShowTaskForm(false);
      triggerFeedback('success', 'Workspace task deployed and logged successfully.');
    } catch (err) {
      triggerFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleTaskResolution = async (taskId, currentStatus, title) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    try {
      await supabase.from('tasks').update({ status: nextStatus }).eq('id', taskId);
      await appendAuditTrail('TASK_UPDATE', `Modified status vector for [${title}] to (${nextStatus.toUpperCase()})`);
      await synchronizeSectorData();
    } catch (err) {
      console.error(err);
    }
  };

  // 🛠️ ADMIN ROUTINE: Delete individual task node
  const handleDeleteTask = async (taskId, taskTitle) => {
    if (!isGroupCreator) return triggerFeedback('error', 'Unauthorized: Admin privileges required.');
    if (!confirm(`Are you sure you want to permanently delete task "${taskTitle}"?`)) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;

      await appendAuditTrail('TASK_DELETE', `Deleted and purged objective [${taskTitle}] from the workspace grid.`);
      await synchronizeSectorData();
      triggerFeedback('success', 'Task removed successfully.');
    } catch (err) {
      triggerFeedback('error', err.message);
    }
  };

  // 🥾 ADMIN ROUTINE: Kick a member out of the group cluster matrix
  const handleKickMember = async (targetUserId, targetName) => {
  if (!isGroupCreator) return triggerFeedback('error', 'Unauthorized: Admin privileges required.');
  if (targetUserId === user.id) return triggerFeedback('error', 'Action fault: You cannot evict yourself.');
  if (!confirm(`Are you sure you want to remove ${targetName} from this cluster sector?`)) return;

  try {
    // 1. Break the user's active connection pointer link first
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ current_cluster_id: null })
      .eq('id', targetUserId);

    if (userUpdateError) throw userUpdateError;

    // 2. Permanently delete their row from the membership junction ledger
    const { error: membershipError } = await supabase
      .from('cluster_memberships')
      .delete()
      .eq('cluster_id', clusterId)
      .eq('user_id', targetUserId);

    if (membershipError) throw membershipError;

    // 3. Write the eviction history event to the shared cluster activity audit trail
    await appendAuditTrail('MEMBER_EVICT', `Evicted unit profile [${targetName}] from this cluster node sector.`);
    
    // 4. Re-fetch fresh grid rows from the database to synchronize the view state structure
    await synchronizeSectorData();
    
    // 5. Present the success confirmation feedback alert box ONLY after successful backend operations
    triggerFeedback('success', `${targetName} has been evicted from this sector.`);
    
  } catch (err) {
    console.error("Eviction Pipeline Fault:", err);
    triggerFeedback('error', `Eviction Fault: ${err.message}`);
  }
};

  // ⚠️ ADMIN ROUTINE: Erase and wipe the entire Cluster completely
  const handleDissolveCluster = async () => {
    if (!isGroupCreator) return triggerFeedback('error', 'Unauthorized: Admin privileges required.');
    if (!confirm(`⚠️ CRITICAL WARNING: Dissolving will permanently wipe this cluster, all associated task registers, and logs. This cannot be undone. Proceed?`)) return;

    setActionLoading(true);
    try {
      const { error } = await supabase.from('clusters').delete().eq('id', clusterId);
      if (error) throw error;

      // Clean out local state references safely
      const updatedUserObj = { ...user, current_cluster_id: null };
      localStorage.setItem('nebula_session', JSON.stringify(updatedUserObj));

      triggerFeedback('success', 'Cluster sector successfully dissolved.');
      router.push('/dashboard/cluster');
    } catch (err) {
      triggerFeedback('error', err.message);
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs font-mono text-cyan-400 animate-pulse">CONNECTING INTERFACE TO NODE DECK TELEMETRY MATRIX...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-white font-['Inter']">
      
      {/* Dynamic feedback banner channel indicator */}
      {feedback.text && (
        <div className={`p-4 rounded-xl text-xs font-mono border transition-all ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          ⚙️ NODE DECK LOGS // {feedback.text}
        </div>
      )}

      {/* Top Navigation Row Context Back Anchor Trigger */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/cluster')} className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors uppercase font-bold tracking-wider">
          ⇦ Return to Grid Selection Hub
        </button>
        <span className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-bold uppercase tracking-widest">
          Sector Node ID: {clusterId.slice(0,8)}...
        </span>
      </div>

      {/* Header Deck Panel summary data */}
      <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-widest">Operational Core Locked</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold mt-1 text-[#dae2fd]">{currentCluster?.name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{currentCluster?.description || 'No direct summaries documented.'}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2 shrink-0 w-full md:w-auto">
          <div className="bg-black/30 px-5 py-2.5 rounded-xl border border-white/5 text-center min-w-[120px] w-full md:w-auto">
            <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold tracking-wider">Access Sync Key</span>
            <span className="text-base font-mono font-bold tracking-widest text-cyan-400">{currentCluster?.access_code}</span>
          </div>
          
          {/* Creator Cluster Purging Trigger button */}
          {isGroupCreator && (
            <button 
              onClick={handleDissolveCluster}
              disabled={actionLoading}
              className="w-full md:w-auto text-[9px] font-mono font-bold tracking-wider uppercase text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              {actionLoading ? 'DISSOLVING SECTOR...' : '⚠️ Dissolve Cluster Node'}
            </button>
          )}
        </div>
      </div>

      {/* Tab Selector Buttons Deck */}
      <div className="flex border-b border-white/10 gap-2 text-xs font-mono">
        {['tasks', 'logs', 'manifest'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2.5 px-4 uppercase font-bold tracking-wider transition-all border-b-2 -mb-[2px] ${activeTab === tab ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {tab === 'tasks' ? '🗂️ Task Matrices' : tab === 'logs' ? '📜 Operational Timelines' : '👥 Unit Manifest'}
          </button>
        ))}
      </div>

      {/* Sub-routing Views panels */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-gray-200">Shared Objectives Board</h3>
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="py-1.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold rounded-lg uppercase tracking-wide transition-colors">
              {showTaskForm ? '✕ Close Deck' : '✍️ Deploy Task Unit'}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleCreateClusterTask} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 max-w-xl animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Task Vector Objective *</label>
                  <input required type="text" placeholder="e.g. Map onboarding data endpoints layout" className="w-full p-2 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-cyan-400 text-white" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Priority Hierarchy</label>
                  <select className="w-full p-2 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none text-white" value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                    <option value={1}>Tier 1 [Critical]</option>
                    <option value={2}>Tier 2 [High]</option>
                    <option value={3}>Tier 3 [Standard]</option>
                    <option value={4}>Tier 4 [Low]</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Target Assignments Vector (Tag usernames with commas)</label>
                <input type="text" placeholder="Use @all for everyone, or split individuals with commas..." className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-400" value={tagInputValue} onChange={e => setTagInputValue(e.target.value)} />
                <p className="text-[9px] text-gray-500 mt-1 font-mono">Available room matches: <span className="text-gray-400">{clusterMembers.map(m => `@${m.name || m.email.split('@')[0]}`).join(', ')}</span></p>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Directives Document Logs Notes</label>
                <textarea rows="2" placeholder="Appended requirements documentation specifications records..." className="w-full p-2 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none resize-none text-white" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
              </div>

              <button disabled={actionLoading} type="submit" className="w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl">DISPATCH NODE OBJECTIVE</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusterTasks.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono py-8 col-span-2 text-center">No active workspace tasks mapped to this cluster quadrant yet.</p>
            ) : (
              clusterTasks.map((task) => {
                const mappedTags = typeof task.assigned_tags === 'string' ? JSON.parse(task.assigned_tags) : (task.assigned_tags || []);
                return (
                  <div key={task.id} className={`p-4 rounded-2xl border transition-all ${task.status === 'completed' ? 'bg-black/10 border-white/5 opacity-40' : 'bg-[#131315]/50 border-white/10 hover:border-white/20'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold tracking-tight ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{task.description || 'No descriptive logs summarized.'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button onClick={() => toggleTaskResolution(task.id, task.status, task.title)} className={`p-1.5 rounded-lg border text-[10px] font-mono transition-colors ${task.status === 'completed' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-white/10 text-gray-400 hover:text-white'}`}>
                          {task.status === 'completed' ? '✓ RESOLVED' : '◯ CLOSE'}
                        </button>
                        
                        {/* Admin Controlled Task Drop Trigger */}
                        {isGroupCreator && (
                          <button 
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/5 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30 transition-all font-semibold"
                          >
                            ✕ Purge Task
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1 items-center">
                      <span className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mr-1 font-bold">Assigned:</span>
                      {task.is_assigned_to_all ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider">📢 @ALL MEMBERS</span>
                      ) : mappedTags.length === 0 ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-500 italic">Independent Hub</span>
                      ) : (
                        mappedTags.map((tag) => (
                          <span key={tag.id} className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            @{tag.name}
                          </span>
                        ))
                      )}
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ml-auto ${task.priority === 1 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : task.priority === 2 ? 'bg-orange-500/10 text-orange-400' : 'bg-gray-500/10 text-gray-400'}`}>T{task.priority}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-[#131315]/40 border border-white/10 p-5 rounded-2xl space-y-4">
          <h3 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-white/5 pb-2">Operational Timelines Logs Audit</h3>
          <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto font-mono text-xs space-y-2.5 pr-2">
            {clusterLogs.length === 0 ? (
              <p className="text-gray-500 italic text-xs py-4 text-center">Historical log registers are clean.</p>
            ) : (
              clusterLogs.map((log) => (
                <div key={log.id} className="pt-2.5 flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                  <div className="space-y-0.5">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded mr-2 ${log.action_type === 'TASK_CREATE' ? 'bg-cyan-500/10 text-cyan-400' : log.action_type === 'MEMBER_JOIN' ? 'bg-purple-500/10 text-purple-400' : log.action_type === 'TASK_DELETE' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      [{log.action_type}]
                    </span>
                    <span className="text-gray-300">{log.description}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-semibold">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'manifest' && (
        <div className="bg-[#131315]/40 border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider text-purple-300">Operational Profile Manifest Units</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/5 text-gray-400 font-bold">👤 {clusterMembers.length} / 30 Maximum Capacity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clusterMembers.map((member) => (
              <div key={member.id} className="p-3 bg-black/20 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-200">
                    {member.name || member.email.split('@')[0]} {member.id === user?.id && <span className="text-[10px] text-cyan-400 font-mono font-bold">(You)</span>}
                    {member.id === currentCluster?.creator_id && <span className="text-[9px] text-amber-400 font-mono font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded ml-1.5 uppercase tracking-wide">👑 Founder</span>}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{member.email}</p>
                </div>
                <div className="text-right font-mono shrink-0 flex items-center gap-4">
                  <div>
                    <p className="text-purple-400 font-bold">{member.total_xp || 0} XP</p>
                    <p className="text-[9px] text-gray-600 font-bold">LVL {member.current_level || 1}</p>
                  </div>

                  {/* Admin Controlled Member Eviction Trigger */}
                  {isGroupCreator && member.id !== user?.id && (
                    <button
                      onClick={() => handleKickMember(member.id, member.name || member.email.split('@')[0])}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-[10px] uppercase font-bold tracking-wide transition-all"
                    >
                      🥾 Evict
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}