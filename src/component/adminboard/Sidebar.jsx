'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', path: '/adminboard' },
  { name: 'User Management', path: '/adminboard/users' },
  { name: 'Reward Catalog', path: '/adminboard/rewards' },
  { name: 'Analytics', path: '/adminboard/analytics' },
  { name: 'System Logs', path: '/adminboard/logs' },
  { name: 'Messages', path: '/adminboard/messages' },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-purple-900 rounded-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0c] border-r border-white/10 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-8">
          <h2 className="text-purple-400 font-bold tracking-widest uppercase text-sm">Admin Control</h2>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setIsOpen(false)}
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

        <div className="absolute bottom-8 w-full px-8">
          <Link href="/dashboard" className="text-[10px] text-gray-600 hover:text-white transition uppercase tracking-widest">
            ← Return to User View
          </Link>
        </div>
      </aside>

      {/* Background Dimmer for Mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
}