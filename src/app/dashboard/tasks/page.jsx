"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TaskModal from "@/component/dashboard/TaskModal";

export default function TasksPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  
  // Dynamic Tab Control Layer (Defaults to universal ALL scope configuration)
  const [activeTab, setActiveTab] = useState("all");
  const [customTabs, setCustomTabs] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Inspection & Update Drawer State
  const [inspectingTask, setInspectingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState(4);
  const [editDeadlineDate, setEditDeadlineDate] = useState("");
  const [editDeadlineTime, setEditDeadlineTime] = useState("");
  const [editBoardId, setEditBoardId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const fetchUnifiedTaskMatrix = useCallback(async (profile) => {
    setLoading(true);
    try {
      // 1. Load baseline channel paths
      const { data: boardsData } = await supabase.from("boards").select("*").eq("user_id", profile.id);
      setBoards(boardsData || []);
      
      const distinctCategories = new Set(["all", "private", "professional"]);
      if (boardsData) {
        boardsData.forEach(b => distinctCategories.add(b.root_category));
      }
      setCustomTabs(Array.from(distinctCategories));

      // 2. Multi-tier Conditional Data Retrieval Engine
      let query = supabase.from("tasks").select(`*, boards(id, root_category, sub_category)`);
      
      if (activeTab === "all") {
        query = query.eq("user_id", profile.id);
      } else if (activeTab === "private") {
        query = query.eq("user_id", profile.id).is("cluster_id", null).eq("boards.root_category", "private");
      } else if (activeTab === "professional") {
        query = profile.current_cluster_id 
          ? query.eq("cluster_id", profile.current_cluster_id) 
          : query.eq("user_id", profile.id).eq("boards.root_category", "professional");
      } else {
        query = query.eq("user_id", profile.id).eq("boards.root_category", activeTab);
      }

      const { data: tasksData, error } = await query;
      if (!error && tasksData) {
        setTasks(tasksData.filter(t => t.boards !== null || activeTab === "all"));
      }
    } catch (err) {
      console.error("Telemetry structural pipeline fault:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const session = localStorage.getItem("nebula_session");
    if (!session) return router.push("/login");

    const parsedUser = JSON.parse(session);
    setUser(parsedUser);
    fetchUnifiedTaskMatrix(parsedUser);
  }, [router, activeTab, fetchUnifiedTaskMatrix]);

  // Mutation: Wipe out custom columns and cascade clear nested rows
  const handleDeleteColumn = async (categoryName, e) => {
    e.stopPropagation();
    const cleanCategoryName = categoryName.trim().toLowerCase();
    
    if (["all", "private", "professional"].includes(cleanCategoryName)) {
      alert("System Architecture Protected: Native core channels cannot be destroyed.");
      return;
    }

    if (!confirm(`CRITICAL HAZARD ACTION:\nWipe down the column category [${categoryName}] and cascade erase all its nested tasks blueprints?`)) return;

    try {
      const { error } = await supabase
        .from("boards")
        .delete()
        .eq("user_id", user.id)
        .eq("root_category", cleanCategoryName);

      if (error) throw error;
      
      if (activeTab === cleanCategoryName) setActiveTab("all");
      fetchUnifiedTaskMatrix(user);
    } catch (err) {
      alert(`Purge execution failure: ${err.message}`);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus, e) => {
    e.stopPropagation();
    const { error } = await supabase.from("tasks").update({ is_completed: !currentStatus }).eq("id", taskId);
    if (!error) {
      if (inspectingTask?.id === taskId) setInspectingTask(null);
      fetchUnifiedTaskMatrix(user);
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    e.stopPropagation();
    if (!confirm("Terminate this unique objective vector permanently?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (!error) {
      if (inspectingTask?.id === taskId) setInspectingTask(null);
      fetchUnifiedTaskMatrix(user);
    }
  };

  const handleOpenInspectDrawer = (task) => {
    setInspectingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditPriority(task.priority);
    setEditBoardId(task.board_id || "");
    
    if (task.target_deadline) {
      const d = new Date(task.target_deadline);
      setEditDeadlineDate(d.toISOString().split("T")[0]);
      setEditDeadlineTime(d.toTimeString().split(" ")[0].substring(0, 5));
    } else {
      setEditDeadlineDate("");
      setEditDeadlineTime("");
    }
  };

  const handleSaveChanges = async (e) => {
  e.preventDefault();
  if (!editTitle.trim() || !inspectingTask || !editBoardId) return;
  setIsUpdating(true);

  // Guard and format the deadline securely
  let parsedDeadline = null;
  if (editDeadlineDate) {
    // If the time field is left unselected, default to noon (12:00) to keep the ISO format valid
    const cleanTime = editDeadlineTime ? editDeadlineTime : "12:00";
    parsedDeadline = `${editDeadlineDate}T${cleanTime}:00Z`;
  }

  const targetedBoard = boards.find(b => b.id === editBoardId);

  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTitle.trim(),
        description: editDesc.trim() || null,
        priority: parseInt(editPriority),
        target_deadline: parsedDeadline,
        board_id: editBoardId,
        cluster_id: targetedBoard?.root_category === "professional" ? user.current_cluster_id : null
      })
      .eq("id", inspectingTask.id);

    if (error) throw error;

    setInspectingTask(null);
    fetchUnifiedTaskMatrix(user);
  } catch (err) {
    alert(`Update Fault: ${err.message}`);
  } finally {
    setIsUpdating(false);
  }
};

  const getSortedTasks = (itemsArray) => {
    const sorted = [...itemsArray];
    if (sortBy === "priority") {
      return sorted.sort((a, b) => a.priority - b.priority);
    }
    return sorted.sort((a, b) => {
      if (!a.target_deadline) return 1;
      if (!b.target_deadline) return -1;
      return new Date(a.target_deadline) - new Date(b.target_deadline);
    });
  };

  const activeTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  const groupTasksByMonth = (tasksArray) => {
    const groups = {};
    getSortedTasks(tasksArray).forEach(task => {
      let monthKey = "Undesignated Timelines";
      if (task.target_deadline) {
        const dateObj = new Date(task.target_deadline);
        monthKey = dateObj.toLocaleString("default", { month: "long", year: "numeric" });
      }
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(task);
    });
    return groups;
  };

  const groupedActiveTasks = groupTasksByMonth(activeTasks);

  if (!user) return null;

  return (
    <div className="min-h-screen text-white font-['Inter'] p-4 md:p-8 flex relative overflow-hidden">
      
      <div className="flex-grow max-w-5xl mx-auto space-y-6 transition-all duration-300">
        
        {/* Top Operational Command Card */}
        <div className="p-6 rounded-3xl bg-[#131315]/40 border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-[#dae2fd]">Operational Tasks Registry</h1>
            <p className="text-xs text-gray-400">Manage, sort, and re-route deployment pipelines across your workspace columns.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto px-5 py-3 button-gradient rounded-xl font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider">
            ➕ Deploy Mission Objective
          </button>
        </div>

        {/* Categories Tab Matrix Bar (With ALL option & Column Clear mechanics) */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
          {customTabs.map(tab => {
            const isNative = ["all", "private", "professional"].includes(tab);
            return (
              <div 
                key={`tab-container-${tab}`} 
                className={`flex items-center gap-1.5 pb-2 px-3 transition-all border-b-2 capitalize text-xs font-['Space_Grotesk'] ${
                  activeTab === tab ? "text-cyan-400 border-cyan-400 font-bold" : "text-gray-500 border-transparent"
                }`}
              >
                <button onClick={() => setActiveTab(tab)} className="tracking-widest">
                  {tab === "all" ? "🌐 ALL SECTORS" : tab}
                </button>
                {!isNative && (
                  <button 
                    onClick={(e) => handleDeleteColumn(tab, e)} 
                    className="text-[10px] text-red-500 hover:text-red-400 font-['JetBrains_Mono'] px-1 bg-red-500/10 rounded ml-1"
                    title="Purge Category Column Matrix"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Data Controllers Segment Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white/5 rounded-xl border border-white/5 gap-3 text-xs">
          <div className="text-gray-400 font-['JetBrains_Mono'] text-[11px] uppercase">
            Filtered Matrix Nodes: <span className="text-cyan-400 font-bold">{activeTasks.length} Active</span> | <span className="text-green-400 font-bold">{completedTasks.length} Completed</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSortBy("date")} className={`px-3 py-1 rounded-lg transition-all ${sortBy === "date" ? "bg-cyan-500 text-black font-bold" : "bg-white/5 text-gray-400"}`}>📆 Timeline Matrix</button>
            <button onClick={() => setSortBy("priority")} className={`px-3 py-1 rounded-lg transition-all ${sortBy === "priority" ? "bg-purple-500 text-white font-bold" : "bg-white/5 text-gray-400"}`}>🔥 Priority Weights</button>
          </div>
        </div>

        {/* Chronological Active Workspace Box Matrix */}
        {loading ? (
          <p className="text-xs font-['JetBrains_Mono'] text-gray-500 animate-pulse">Syncing tracking logs...</p>
        ) : Object.keys(groupedActiveTasks).length === 0 ? (
          <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-gray-500 text-xs font-['JetBrains_Mono']">
            No active tactical node items initialized inside this quadrant view.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedActiveTasks).map(month => (
              <div key={`month-group-${month}`} className="space-y-3">
                <h3 className="text-xs font-['JetBrains_Mono'] uppercase tracking-widest text-purple-400 bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/10 inline-block">
                  📅 {month}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 border-l border-white/5">
                  {groupedActiveTasks[month].map(task => (
                    <div 
                      key={`task-node-${task.id}`} 
                      onClick={() => handleOpenInspectDrawer(task)}
                      className="p-5 bg-[#131315]/60 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden cursor-pointer group hover:border-cyan-500/40 hover:bg-[#161619] transition-all duration-300 shadow-lg hover:shadow-cyan-500/5"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 group-hover:h-[4px] ${
                        task.priority === 1 ? "bg-red-500 shadow-[0_2px_10px_#ef4444]" : 
                        task.priority === 2 ? "bg-amber-500" : "bg-cyan-500"
                      }`} />
                      
                      {/* RICH VISUAL CARD DISPLAY LAYER */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 uppercase tracking-tight">
                            /{task.boards?.root_category || "root"} / {task.boards?.sub_category || "general"}
                          </span>
                          <span className={`text-[9px] font-['JetBrains_Mono'] uppercase px-2 py-0.5 rounded ${
                            task.priority === 1 ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            task.priority === 2 ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-gray-400"
                          }`}>
                            P-{task.priority}
                          </span>
                        </div>
                        
                        <h4 className="text-base font-bold font-['Space_Grotesk'] text-[#dae2fd] group-hover:text-cyan-300 transition-colors">
                          {task.title}
                        </h4>
                        
                        {/* Persistent Visible Partial Content Panel */}
                        <p className="text-xs text-gray-400 line-clamp-3 bg-black/10 p-2.5 rounded-xl border border-white/5 font-mono">
                          {task.description || "⚡ No secondary description parameters configured for this deployment vector node."}
                        </p>
                      </div>

                      {/* Control Panel Action Layer Items Trigger Row Buttons */}
                      <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-['JetBrains_Mono'] gap-2">
                        <span>
                          {task.target_deadline ? `🎯 End: ${new Date(task.target_deadline).toLocaleDateString()}` : "🌌 No deadline"}
                        </span>
                        
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => handleToggleComplete(task.id, task.is_completed, e)} className="px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20">
                            ✓ Complete
                          </button>
                          <button onClick={(e) => handleDeleteTask(task.id, e)} className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20">
                            ✕ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Complete Archive Storage Core Anchor Box Drop Floor */}
        {completedTasks.length > 0 && (
          <div className="pt-8 border-t border-white/10 mt-12 space-y-4">
            <h3 className="text-xs font-['JetBrains_Mono'] text-green-400 uppercase tracking-widest block font-bold">✓ Vaulted Archive Logs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40 hover:opacity-90 transition-opacity">
              {getSortedTasks(completedTasks).map(task => (
                <div key={`completed-node-${task.id}`} onClick={() => handleOpenInspectDrawer(task)} className="p-4 bg-black/40 border border-green-500/20 rounded-2xl flex flex-col justify-between space-y-3 cursor-pointer">
                  <div>
                    <h5 className="text-sm font-bold text-gray-400 line-through truncate">{task.title}</h5>
                    <span className="text-[9px] text-gray-600 font-['JetBrains_Mono']">/{task.boards?.root_category}/{task.boards?.sub_category}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <button onClick={(e) => handleToggleComplete(task.id, task.is_completed, e)} className="text-[9px] font-['JetBrains_Mono'] text-yellow-500 underline">Re-activate</button>
                    <button onClick={(e) => handleDeleteTask(task.id, e)} className="text-[9px] font-['JetBrains_Mono'] text-red-500 remove-underline">Purge</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🔮 SLIDE-OUT METRICS EDIT & INSPECTION DRAWER HUD (FULLY DYNAMIC ROUTING VIA DROPDOWN) */}
      {inspectingTask && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#111113] border-l border-white/10 shadow-2xl z-50 flex flex-col p-6 text-white animate-slideLeft transition-all">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-cyan-400">Task Matrix Inspector</h3>
              <span className="text-[9px] text-gray-500 font-['JetBrains_Mono']">Modifying Payload Sequence</span>
            </div>
            <button onClick={() => setInspectingTask(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
          </div>

          <form onSubmit={handleSaveChanges} className="flex-grow flex flex-col justify-between space-y-4 overflow-y-auto pr-1">
            <div className="space-y-4">
              
              {/* 🔄 DYNAMIC RE-ROUTING DROPDOWN FOR CORE QUADRANT PATHS */}
              <div>
                <label className="block text-[10px] font-['JetBrains_Mono'] text-purple-400 uppercase tracking-wider mb-1">
                  Active Quadrant Node Path (Editable)
                </label>
                <select
                  required
                  className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-400 capitalize font-['Space_Grotesk'] font-bold"
                  value={editBoardId}
                  onChange={e => setEditBoardId(e.target.value)}
                >
                  {boards.map(b => (
                    <option key={`drawer-select-board-${b.id}`} value={b.id}>
                      📁 {b.root_category} / {b.sub_category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-['JetBrains_Mono'] text-gray-400 uppercase mb-1">Objective Header</label>
                <input required type="text" className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-400" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              </div>

              <div>
                <label className="block text-[10px] font-['JetBrains_Mono'] text-gray-400 uppercase mb-1">Core Telemetry Docs</label>
                <textarea rows="5" className="w-full p-3 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs focus:outline-none resize-none font-mono" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-['JetBrains_Mono'] text-gray-400 uppercase mb-1">Priority Scale</label>
                    <select className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs text-white focus:outline-none" value={editPriority} onChange={e => setEditPriority(e.target.value)}>
                    <option value={1}>🔥 Tier 1</option>
                    <option value={2}>⚡ Tier 2</option>
                    <option value={3}>🪐 Tier 3</option>
                    <option value={4}>💤 Tier 4</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-['JetBrains_Mono'] text-gray-400 uppercase mb-1">Deadline Horizon</label>
                        <div className="space-y-1">
                                <input 
                                    type="date" 
                                    className="w-full p-2 bg-[#1b1b1f] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400" 
                                    value={editDeadlineDate} 
                                    onChange={e => setEditDeadlineDate(e.target.value)} 
                                />
                                <input 
                                    type="time" 
                                    className="w-full p-2 bg-[#1b1b1f] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400" 
                                    value={editDeadlineTime} 
                                    onChange={e => setEditDeadlineTime(e.target.value)} 
                                />
                        </div>
                </div>
            </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-2">
              <button type="button" onClick={() => setInspectingTask(null)} className="flex-1 py-2.5 border border-white/10 text-xs font-['JetBrains_Mono'] rounded-xl uppercase">Close</button>
              <button type="submit" disabled={isUpdating} className="flex-1 py-2.5 button-gradient text-xs font-['JetBrains_Mono'] uppercase rounded-xl tracking-wider disabled:opacity-40">
                {isUpdating ? "Overwriting..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} onTaskCreated={() => fetchUnifiedTaskMatrix(user)} />
    </div>
  );
}