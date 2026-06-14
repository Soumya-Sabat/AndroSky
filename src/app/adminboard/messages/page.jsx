'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, read: 0, unread: 0 });

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error:", error);
    } else {
      setMessages(data || []);
      setStats({
        total: data?.length || 0,
        read: data?.filter(m => m.is_read).length || 0,
        unread: data?.filter(m => !m.is_read).length || 0
      });
    }
    setLoading(false);
  }

  async function toggleReadStatus(id, currentStatus) {
    await supabase
      .from('contact_messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);
    fetchMessages();
  }

  async function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === 'read' && !msg.is_read) return false;
    if (filter === 'unread' && msg.is_read) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return msg.name.toLowerCase().includes(search) || 
             msg.email.toLowerCase().includes(search) || 
             msg.message.toLowerCase().includes(search);
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Customer Inquiries
        </h1>
        <p className="text-[var(--text-primary)] text-sm mt-1">
          Manage and respond to messages from your users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📬</span>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
              <div className="text-xs text-[var(--text-primary)]/70">Total Messages</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.read}</div>
              <div className="text-xs text-[var(--text-primary)]/70">Read Messages</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <div className="text-2xl font-bold text-orange-400">{stats.unread}</div>
              <div className="text-xs text-[var(--text-primary)]/70">Unread Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-lg">search</span>
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === 'all' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-white/5 text-[var(--text-primary)] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === 'unread' 
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                : 'bg-white/5 text-[var(--text-primary)] hover:text-white'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === 'read' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/5 text-[var(--text-primary)] hover:text-white'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-[var(--surface)]/60 rounded-xl p-12 text-center border border-white/10">
          <span className="text-5xl mb-3 block">📭</span>
          <h3 className="text-white font-medium mb-2">No messages found</h3>
          <p className="text-[var(--text-primary)] text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`group bg-[var(--surface)]/60 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                msg.is_read 
                  ? 'border-white/10 hover:border-cyan-500/30' 
                  : 'border-purple-500/50 shadow-lg shadow-purple-500/10'
              }`}
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      msg.is_read 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      <span className="text-lg">{msg.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] font-semibold text-white">{msg.name}</h3>
                      <p className="text-xs text-[var(--text-primary)]/60">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    )}
                    <span className="text-[10px] text-[var(--text-primary)]/50">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>

                {/* Message Preview */}
                <p className="text-sm text-[var(--text-primary)] line-clamp-2 mb-4">
                  {msg.message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReadStatus(msg.id, msg.is_read);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg transition ${
                      msg.is_read 
                        ? 'bg-white/10 text-[var(--text-primary)] hover:bg-cyan-500/20 hover:text-cyan-400' 
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                    }`}
                  >
                    {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(msg.id);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-full max-w-2xl border border-white/10 max-h-[85vh] overflow-y-auto">
            <div className="p-5 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[var(--surface)]">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedMessage.is_read 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  <span className="text-xl">{selectedMessage.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">{selectedMessage.name}</h3>
                  <p className="text-sm text-[var(--text-primary)]/70">{selectedMessage.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Message Metadata */}
              <div className="flex flex-wrap gap-4 pb-3 border-b border-white/10">
                <div>
                  <span className="text-xs text-[var(--text-primary)]/60">Received</span>
                  <p className="text-sm text-white">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-primary)]/60">Status</span>
                  <p className="text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      selectedMessage.is_read 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {selectedMessage.is_read ? '✓ Read' : '○ Unread'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <span className="text-xs text-[var(--text-primary)]/60 uppercase tracking-wider">Message</span>
                <div className="mt-2 p-4 bg-[var(--surface-low)] rounded-xl text-white whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick Reply Section */}
              <div className="pt-3">
                <span className="text-xs text-[var(--text-primary)]/60 uppercase tracking-wider">Quick Reply</span>
                <div className="mt-2 flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry from AndroSky`}
                    className="flex-1 text-center px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.is_read)}
                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                  >
                    {selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}