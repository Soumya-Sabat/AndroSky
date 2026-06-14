'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function MobileSidebar({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-20 left-4 z-20 w-10 h-10 rounded-full bg-[var(--surface)]/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-200"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[var(--accent-cyan)]">menu</span>
      </button>

      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </>
  );
}