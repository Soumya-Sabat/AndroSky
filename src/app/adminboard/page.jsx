'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminBoardPage() {
  const [usersList, setUsersList] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [pointsInput, setPointsInput] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSystemLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      setUsersList(users || []);

      const { data: tasks } = await supabase.from('tasks').select('*').is('assigned_points', null);
      setPendingTasks(tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(session);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
    } else {
      fetchSystemLogs();
    }
  }, [router, fetchSystemLogs]);

  const handleAssignPoints = async (taskId) => {
    const pointsValue = parseInt(pointsInput[taskId]);
    if (isNaN(pointsValue)) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ assigned_points: pointsValue })
        .eq("id", taskId);

      if (error) throw error;
      setPointsInput(prev => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      fetchSystemLogs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('nebula_session');
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-white font-['Inter']">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Admin Header Dashboard Card */}
        <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-['JetBrains_Mono'] text-pink-400 uppercase tracking-widest block mb-1">
              Root System Clearance Override Active
            </span>
            <h1 className="text-2xl font-bold font-['Space_Grotesk']">Operations Control Mainframe</h1>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-red-500/20 text-red-300">
            Disconnect Terminal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Block - Point Arbitration Grid System */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#131315]/40 border border-white/10 backdrop-blur-md space-y-4">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-cyan-400 border-b border-white/5 pb-2">
              Point Arbitration Core
            </h3>
            {loading ? (
              <p className="text-xs font-['JetBrains_Mono'] text-gray-500 animate-pulse">Syncing task blocks...</p>
            ) : pendingTasks.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 font-['JetBrains_Mono']">All task payloads fully calibrated.</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {pendingTasks.map(task => (
                  <div key={task.id} className="p-3 bg-white/5 rounded-xl flex justify-between items-center border border-white/5">
                    <div className="truncate max-w-[60%]">
                      <p className="text-sm font-bold text-white truncate">{task.title}</p>
                      <span className="text-[9px] text-purple-400 font-['JetBrains_Mono'] uppercase">User Ref: {task.user_id.substring(0,8)}...</span>
                    </div>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Pts" className="w-16 p-1.5 bg-[#1b1b1f] border border-white/10 rounded-lg text-xs text-center text-amber-400" value={pointsInput[task.id] || ""} onChange={e => setPointsInput({...pointsInput, [task.id]: e.target.value})} />
                      <button onClick={() => handleAssignPoints(task.id)} className="px-3 py-1 bg-cyan-500 text-black text-xs font-bold font-['JetBrains_Mono'] rounded-lg uppercase">Lock</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Block - Users Registry Grid System */}
          <div className="p-6 rounded-2xl bg-[#131315]/40 border border-white/10 backdrop-blur-md space-y-4">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pink-400 border-b border-white/5 pb-2">
              Identity Registry
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {usersList.map(u => (
                <div key={u.id} className="p-2.5 bg-white/5 rounded-xl flex justify-between items-center text-xs">
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{u.name}</p>
                    <span className="text-gray-500 font-['JetBrains_Mono'] block truncate">{u.email}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-['JetBrains_Mono'] text-[9px] uppercase ${u.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}