'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', icon: '📊', href: '/dashboard', color: 'cyan' },
  { name: 'Tasks', icon: '✅', href: '/dashboard/tasks', color: 'cyan' },
  { name: 'Clusters', icon: '👥', href: '/dashboard/cluster', color: 'purple' },
  { name: 'Achievements', icon: '🏆', href: '/dashboard/achievements', color: 'yellow' },
  { name: 'Leaderboard', icon: '📈', href: '/dashboard/leaderboard', color: 'cyan' },
  { name: 'Rewards', icon: '🎁', href: '/dashboard/rewards', color: 'purple' },
  { name: 'Settings', icon: '⚙️', href: '/dashboard/settings', color: 'gray' },
];

export default function SidebarContent({ user, onClose, onLogout }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-xl">
            {user?.name?.[0] || '👤'}
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] font-semibold text-white">
              {user?.name || 'Commander'}
            </h3>
            <p className="text-xs text-[var(--text-primary)]/60 font-['Inter']">
              Level {user?.current_level || 1} • {user?.total_xp || 0} XP
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-[var(--text-primary)]/60 mb-1">
            <span>Progress to next level</span>
            <span>{Math.round((user?.total_xp || 0) / 2700 * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-full transition-all"
              style={{ width: `${Math.min(((user?.total_xp || 0) / 2700) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? `bg-gradient-to-r from-${item.color === 'cyan' ? 'cyan' : item.color === 'purple' ? 'purple' : 'gray'}-500/20 border border-${item.color === 'cyan' ? 'cyan' : item.color === 'purple' ? 'purple' : 'gray'}-500/30` 
                  : 'hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`font-['Inter'] text-sm flex-1 ${
                isActive ? 'text-white' : 'text-[var(--text-primary)] group-hover:text-white'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all duration-200 group"
        >
          <span className="text-xl">🚪</span>
          <span className="font-['Inter'] text-sm text-[var(--text-primary)] group-hover:text-red-400">
            Logout
          </span>
        </button>
        
        <div className="text-center pt-2">
          <p className="text-[10px] text-[var(--text-primary)]/40 font-['JetBrains_Mono']">
            AndroSky v1.0
          </p>
        </div>
      </div>
    </div>
  );
}