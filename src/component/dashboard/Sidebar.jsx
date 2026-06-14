'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', icon: '📊', href: '/dashboard', color: 'cyan' },
  { name: 'Tasks', icon: '✅', href: '/dashboard/tasks', color: 'cyan' },
  { name: 'Clusters', icon: '👥', href: '/dashboard/cluster', color: 'purple' },
  { name: 'Achievements', icon: '🏆', href: '/dashboard/achievements', color: 'yellow' },
  { name: 'Leaderboard', icon: '📈', href: '/dashboard/leaderboard', color: 'cyan' },
  { name: 'Rewards', icon: '🎁', href: '/dashboard/rewards', color: 'purple' },
  { name: 'Settings', icon: '⚙️', href: '/dashboard/settings', color: 'gray' },
];

export default function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nebula_session');
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--surface)]/80 backdrop-blur-xl">
      {/* User Profile Section with Glass Effect */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
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
        
        {/* Glowing Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-[var(--text-primary)]/60 mb-1">
            <span>Rank Progress</span>
            <span>{Math.round((user?.total_xp || 0) / 2700 * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/30"
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
              )}
              <span className="text-xl relative z-10">{item.icon}</span>
              <span className={`font-['Inter'] text-sm flex-1 relative z-10 ${
                isActive ? 'text-white' : 'text-[var(--text-primary)] group-hover:text-white'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse shadow-lg shadow-cyan-500 relative z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all duration-200 group"
        >
          <span className="text-xl">🚪</span>
          <span className="font-['Inter'] text-sm text-[var(--text-primary)] group-hover:text-red-400">
            Exit Command Center
          </span>
        </button>
        
        <div className="text-center pt-2">
          <p className="text-[10px] text-[var(--text-primary)]/30 font-['JetBrains_Mono']">
            AndroSky • Mission Control v1.0
          </p>
        </div>
      </div>
    </div>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={onClose}
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-transparent z-50 transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto custom-scrollbar rounded-r-3xl shadow-2xl shadow-cyan-500/10">
            <SidebarContent />
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="hidden md:block fixed left-0 top-0 h-full w-72 bg-transparent z-30">
      <div className="h-full overflow-y-auto custom-scrollbar">
        <SidebarContent />
      </div>
    </aside>
  );
}