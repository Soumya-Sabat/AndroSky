'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/component/dashboard/Sidebar';
import MobileSidebar from '@/component/dashboard/MobileSidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('nebula_session');
    if (!session) {
      router.push('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(session);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing session:', error);
      router.push('/login');
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-cyan)] mx-auto"></div>
          <p className="text-[var(--text-primary)] mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <MobileSidebar user={user} />
      <div className="md:ml-72">
        <main className="p-6 md:p-8 pt-24 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}