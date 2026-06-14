'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SystemLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedLog, setSelectedLog] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    errors: 0,
    warnings: 0,
    critical: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [searchTerm, filterType, filterSeverity, timeRange, currentPage]);

  async function fetchLogs() {
    setLoading(true);
    try {
      let query = supabase
        .from('system_logs')
        .select('*, users(name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchTerm) {
        query = query.or(`message.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%`);
      }

      if (filterType !== 'all') {
        query = query.eq('log_type', filterType);
      }

      if (filterSeverity !== 'all') {
        query = query.eq('severity', filterSeverity);
      }

      const timeFilter = getTimeRangeFilter();
      if (timeFilter) {
        query = query.gte('created_at', timeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const timeFilter = getTimeRangeFilter();
      
      const { count: total } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', timeFilter);

      const { count: errors } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'error')
        .gte('created_at', timeFilter);

      const { count: warnings } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'warning')
        .gte('created_at', timeFilter);

      const { count: critical } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'critical')
        .gte('created_at', timeFilter);

      setStats({
        total: total || 0,
        errors: errors || 0,
        warnings: warnings || 0,
        critical: critical || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  function getTimeRangeFilter() {
    const now = new Date();
    switch(timeRange) {
      case '1h': 
        return new Date(now.setHours(now.getHours() - 1)).toISOString();
      case '24h': 
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
      case '7d': 
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30d': 
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      default: 
        return new Date(0).toISOString();
    }
  }

  const getSeverityBadge = (severity) => {
    const badges = {
      info: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: 'ℹ️' },
      warning: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⚠️' },
      error: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: '❌' },
      critical: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🔥' }
    };
    return badges[severity] || badges.info;
  };

  const getTypeIcon = (type) => {
    const icons = {
      system: '🖥️',
      application: '📱',
      security: '🔒'
    };
    return icons[type] || '📝';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white mb-2">System Logs</h1>
            <p className="text-[var(--text-primary)] text-sm">Monitor system events, errors, and security alerts</p>
          </div>
          <button
            onClick={() => {
              fetchLogs();
              fetchStats();
            }}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <span className="text-xs text-[var(--text-primary)]/60">Total Events</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <span className="text-xs text-yellow-400/60">Warnings</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.warnings}</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">❌</span>
              <span className="text-xs text-orange-400/60">Errors</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{stats.errors}</div>
          </div>
          <div className="bg-[var(--surface)]/60 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔥</span>
              <span className="text-xs text-red-400/60">Critical</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-lg">search</span>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Types</option>
            <option value="system">🖥️ System</option>
            <option value="application">📱 Application</option>
            <option value="security">🔒 Security</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Severities</option>
            <option value="info">ℹ️ Info</option>
            <option value="warning">⚠️ Warning</option>
            <option value="error">❌ Error</option>
            <option value="critical">🔥 Critical</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="bg-[var(--surface)]/60 rounded-xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
              <p className="text-sm text-[var(--text-primary)] mt-4">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-5xl mb-3 block">📭</span>
              <h3 className="text-white font-medium mb-2">No logs found</h3>
              <p className="text-[var(--text-primary)] text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">SEVERITY</th>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">TYPE</th>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">SOURCE</th>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">MESSAGE</th>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">USER</th>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">TIME</th>
                    <th className="p-4 text-left text-xs font-['JetBrains_Mono'] text-[var(--text-primary)]/60">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {logs.map((log) => {
                    const severityBadge = getSeverityBadge(log.severity);
                    return (
                      <tr 
                        key={log.id} 
                        className="hover:bg-white/5 transition cursor-pointer"
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${severityBadge.color}`}>
                            {severityBadge.icon} {log.severity}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 text-[var(--text-primary)]">
                            {getTypeIcon(log.log_type)} {log.log_type}
                          </span>
                        </td>
                        <td className="p-4 text-[var(--text-primary)] font-mono text-xs">{log.source}</td>
                        <td className="p-4 text-white max-w-md truncate">{log.message}</td>
                        <td className="p-4 text-[var(--text-primary)] text-xs">{log.users?.name || 'System'}</td>
                        <td className="p-4 text-[var(--text-primary)]/60 text-xs whitespace-nowrap">
                          {formatTimestamp(log.created_at)}
                        </td>
                        <td className="p-4">
                          <button className="text-cyan-400 hover:text-cyan-300">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] rounded-2xl w-full max-w-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
              <div className="p-5 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[var(--surface)]">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">Severity</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getSeverityBadge(selectedLog.severity).color}`}>
                        {getSeverityBadge(selectedLog.severity).icon} {selectedLog.severity}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">Type</label>
                    <div className="mt-1 text-white">
                      {getTypeIcon(selectedLog.log_type)} {selectedLog.log_type}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">Source</label>
                    <div className="mt-1 text-white font-mono text-sm">{selectedLog.source}</div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">Timestamp</label>
                    <div className="mt-1 text-white text-sm">
                      {new Date(selectedLog.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--text-primary)]/60">Message</label>
                  <div className="mt-1 p-3 bg-[var(--surface-low)] rounded-lg text-white text-sm">
                    {selectedLog.message}
                  </div>
                </div>

                {selectedLog.details && (
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">Details</label>
                    <pre className="mt-1 p-3 bg-[var(--surface-low)] rounded-lg text-xs text-cyan-400 overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.user_id && (
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">User</label>
                    <div className="mt-1 text-white">{selectedLog.users?.name || selectedLog.user_id}</div>
                  </div>
                )}

                {selectedLog.ip_address && (
                  <div>
                    <label className="text-xs text-[var(--text-primary)]/60">IP Address</label>
                    <div className="mt-1 text-white font-mono text-sm">{selectedLog.ip_address}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}