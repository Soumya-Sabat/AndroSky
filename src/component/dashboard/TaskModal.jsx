"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TaskModal({ isOpen, onClose, user, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [rootCategory, setRootCategory] = useState("private");
  const [isCreatingRoot, setIsCreatingRoot] = useState(false);
  const [newRootCategory, setNewRootCategory] = useState("");
  
  const [subCategory, setSubCategory] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [boards, setBoards] = useState([]);

  const [priority, setPriority] = useState(4);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchUserChannelStructure = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) setBoards(data);
    };

    fetchUserChannelStructure();
  }, [isOpen, user]);

  useEffect(() => {
    const contextFiltered = boards.filter(b => b.root_category === rootCategory);
    if (contextFiltered.length > 0) {
      setSelectedBoardId(contextFiltered[0].id);
    } else {
      setSelectedBoardId("");
    }
  }, [rootCategory, boards]);

  const handleInitializeChannel = async () => {
    if (!user) return;
    setLoading(true);

    const targetRoot = isCreatingRoot ? newRootCategory.trim().toLowerCase() : rootCategory;
    const targetSub = subCategory.trim().toLowerCase() || "general";

    if (!targetRoot) {
      alert("Validation Fault: Category Name Required.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("boards")
        .insert([{
          user_id: user.id,
          root_category: targetRoot,
          sub_category: targetSub,
          cluster_id: targetRoot === "professional" ? user.current_cluster_id : null
        }])
        .select()
        .single();

      if (error) throw error;

      const updatedBoards = [...boards, data];
      setBoards(updatedBoards);
      setRootCategory(data.root_category);
      setSelectedBoardId(data.id);
      
      setSubCategory("");
      setNewRootCategory("");
      setIsCreatingRoot(false);
    } catch (err) {
      alert(`Channel creation fault: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedBoardId) {
      alert("Subject and Sub-Channel selection are mandatory.");
      return;
    }
    setLoading(true);

    let parsedDeadline = null;
    if (deadlineDate) {
      parsedDeadline = deadlineTime ? `${deadlineDate}T${deadlineTime}:00Z` : `${deadlineDate}T12:00:00Z`;
    }

    const currentBoard = boards.find(b => b.id === selectedBoardId);

    try {
      const { error } = await supabase
        .from("tasks")
        .insert([{
          user_id: user.id,
          board_id: selectedBoardId,
          cluster_id: currentBoard?.root_category === "professional" ? user.current_cluster_id : null,
          title: title.trim(),
          description: description.trim() || null,
          priority: parseInt(priority),
          target_deadline: parsedDeadline,
          status: "todo",
          is_completed: false
        }]);

      if (error) throw error;

      setTitle("");
      setDescription("");
      setDeadlineDate("");
      setDeadlineTime("");
      onTaskCreated();
      onClose();
    } catch (err) {
      alert(`Grid insertion error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const uniqueRootCategories = Array.from(
    new Set(["private", "professional", ...boards.map(b => b.root_category)])
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-['Inter'] text-white">
      <div className="w-full max-w-xl p-6 rounded-3xl bg-[#131315] border border-white/10 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#dae2fd]">Deploy Quantum Task Node</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-['JetBrains_Mono'] text-purple-400 uppercase tracking-wider">Target Workspace Category</label>
            <button type="button" onClick={() => setIsCreatingRoot(!isCreatingRoot)} className="text-xs text-cyan-400 hover:underline">
              {isCreatingRoot ? "Cancel Split" : "📁 Create New Category"}
            </button>
          </div>

          {isCreatingRoot ? (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" placeholder="Category Name (e.g. fitness)" className="p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs text-white" value={newRootCategory} onChange={e => setNewRootCategory(e.target.value)} />
                <input type="text" placeholder="Sub-channel name (e.g. workout)" className="p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs text-white" value={subCategory} onChange={e => setSubCategory(e.target.value)} />
              </div>
              <button type="button" onClick={handleInitializeChannel} className="w-full py-2 bg-cyan-500 text-black text-xs font-bold font-['JetBrains_Mono'] rounded-xl uppercase">Initialize Workspace Context</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-1 bg-black/10 rounded-lg">
                {uniqueRootCategories.map(root => (
                  <button
                    key={`modal-root-${root}`}
                    type="button"
                    onClick={() => setRootCategory(root)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-['JetBrains_Mono'] tracking-wider border transition-all ${
                      rootCategory === root 
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40" 
                        : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                    }`}
                  >
                    {root}
                  </button>
                ))}
              </div>

              <div>
                <select 
                  className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs capitalize text-white focus:outline-none"
                  value={selectedBoardId}
                  onChange={e => setSelectedBoardId(e.target.value)}
                >
                  <option value="">-- Select Active Subcategory Dropdown --</option>
                  {boards.filter(b => b.root_category === rootCategory).map(b => (
                    <option key={`dropdown-board-${b.id}`} value={b.id}>{b.root_category} / {b.sub_category}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmitTask} className="space-y-4">
          <div>
            <label className="block text-[11px] font-['JetBrains_Mono'] text-cyan-400 uppercase tracking-widest mb-1">Subject Title *</label>
            <input type="text" required placeholder="Designate active objective title..." className="w-full p-3 bg-[#1b1b1f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-['JetBrains_Mono'] text-gray-400 uppercase tracking-widest mb-1">Priority Scale Vector</label>
              <select className="w-full p-2.5 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs text-white focus:outline-none" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value={1}>🔥 Priority Tier 1 (Critical Target)</option>
                <option value={2}>⚡ Priority Tier 2 (High Orbit)</option>
                <option value={3}>🪐 Priority Tier 3 (Standard Cruise)</option>
                <option value={4}>💤 Priority Tier 4 (Low Execution)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-['JetBrains_Mono'] text-gray-400 uppercase tracking-widest mb-1">Chrono Deadline</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="p-2 bg-[#1b1b1f] border border-white/10 rounded-lg text-xs text-white focus:outline-none" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
                <input type="time" className="p-2 bg-[#1b1b1f] border border-white/10 rounded-lg text-xs text-white focus:outline-none" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-['JetBrains_Mono'] text-gray-400 uppercase tracking-widest mb-1">Summary Documentation</label>
            <textarea rows="2" placeholder="Optional context descriptions..." className="w-full p-3 bg-[#1b1b1f] border border-white/10 rounded-xl text-xs text-white focus:outline-none resize-none" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-xs uppercase font-['JetBrains_Mono']">Abort</button>
            <button type="submit" disabled={loading || !selectedBoardId} className="flex-1 py-2.5 button-gradient rounded-xl text-xs uppercase font-['JetBrains_Mono'] tracking-wider disabled:opacity-40">Commit Node</button>
          </div>
        </form>
      </div>
    </div>
  );
}