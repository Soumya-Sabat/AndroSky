'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { name: 'Dashboard', path: '/adminboard' },
  { name: 'User Management', path: '/adminboard/users' },
  { name: 'Reward Catalog', path: '/adminboard/rewards' },
  { name: 'Analytics', path: '/adminboard/analytics' },
  { name: 'System Logs', path: '/adminboard/logs' },
  { name: 'Messages', path: '/adminboard/messages' },
  { name: 'Academic Docs', path: '/adminboard/docs' },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('nebula_session');
    router.push('/');
  };
  
  return (
    <>
      {/* Mobile Toggle Button - Sticky */}
      <button 
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-purple-900 rounded-lg text-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar - Sticky on desktop */}
      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'sticky top-0 h-screen'}
        w-64 bg-[#0a0a0c] border-r border-white/10 
        transform transition-transform duration-300 
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8">
            <h2 className="text-purple-400 font-bold tracking-widest uppercase text-sm">Admin Control</h2>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                  pathname === item.path 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all duration-200 group"
            >
              <span className="text-xl">🚪</span>
              <span className="font-['Inter'] text-sm text-gray-400 group-hover:text-red-400">
                Exit Command Center
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Background Dimmer for Mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}