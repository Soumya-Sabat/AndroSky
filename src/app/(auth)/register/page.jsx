'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const router = useRouter();

  // Create floating particles effect
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: `${Math.random() * 10}s`,
          duration: `${Math.random() * 8 + 4}s`,
          size: `${Math.random() * 4 + 2}px`,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Initializing data node connection...' });

    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return setStatus({ type: 'error', text: 'Telemetry Fault: Minimum 10 digits required for Phone format.' });
    }

    try {
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('name, email, phone')
        .or(`name.ilike.${form.name.trim()},email.ilike.${form.email.trim()}`);

      if (fetchError) throw fetchError;

      if (existingUsers && existingUsers.length > 0) {
        if (existingUsers.some(u => u.name === form.name.trim())) {
            setTimeout(() => router.push('/login'), 2000);
          return setStatus({ type: 'error', text: 'This commander name has been claimed by another crew member. Chooose a new! ' });
        }
        if (existingUsers.some(u => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
           setTimeout(() => router.push('/login'), 2000);
          return setStatus({ type: 'error', text: 'This email address is already registered across the grid. Redirecting you to access your terminal' });
        }
      }

      const { count: phoneCount, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('phone', cleanPhone);

      if (countError) throw countError;
      if (phoneCount >= 2) {
        return setStatus({ type: 'error', text: 'Maximum account limit reached (Max 2 accounts per phone number).' });
      }

      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: cleanPhone,
          role: 'user',
          total_xp: 0,
          nebula_coins: 100,
          current_level: 1
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      localStorage.setItem('nebula_session', JSON.stringify(insertedUser));

      setStatus({ type: 'success', text: '🚀 Odyssey Initialized! Syncing command deck...' });
      setTimeout(() => router.push('/dashboard'), 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setStatus({ type: 'error', text: err.message || 'Transmission error across grid.' });
    }
  };

  return (
    <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Animated Orbital Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 animate-orbit-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-500/10 animate-orbit-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-cyan-500/5 animate-orbit-slower" />
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400/30 pointer-events-none animate-float"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      {/* Glowing Orbs in Corners */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full filter blur-[120px] animate-pulse animation-delay-2000 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-40 h-40 bg-cyan-500/5 rounded-full filter blur-[80px] animate-pulse animation-delay-4000 pointer-events-none" />

      {/* Shooting Stars */}
      <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0 pointer-events-none" />
      <div className="absolute top-[60%] left-[70%] w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-5000 pointer-events-none" />
      <div className="absolute top-[80%] left-[30%] w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-8000 pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md p-6 md:p-8 rounded-3xl bg-[#131315]/60 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.05)] relative z-20">
        <div className="text-center mb-6 md:mb-8">
          {/* Animated Icon */}
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-[#dae2fd] mb-2">
            Join the Odyssey
          </h3>
          <p className="text-xs md:text-sm text-[#c6c6cd]">
            Deploy your telemetry coordinates to the live database.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] md:text-xs font-['JetBrains_Mono'] text-cyan-400 uppercase tracking-widest mb-1.5 pl-1">
              Commander Identity
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50 text-lg">👤</span>
              <input 
                type="text" 
                placeholder="Username designation" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-[#131315]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder-gray-500" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-['JetBrains_Mono'] text-cyan-400 uppercase tracking-widest mb-1.5 pl-1">
              Subspace Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50 text-lg">📧</span>
              <input 
                type="email" 
                placeholder="name@sector.com" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-[#131315]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder-gray-500" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-['JetBrains_Mono'] text-cyan-400 uppercase tracking-widest mb-1.5 pl-1">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50 text-lg">📱</span>
              <input 
                type="tel" 
                placeholder="10-digit comms sequence" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-[#131315]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all font-['JetBrains_Mono'] placeholder-gray-500" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status.type === 'loading'} 
            className="button-gradient w-full py-3.5 mt-2 rounded-xl font-['JetBrains_Mono'] text-white text-xs md:text-sm uppercase tracking-wider neon-glow-cyan active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {status.type === 'loading' ? 'Syncing Coordinates...' : 'Establish Profile ✨'}
          </button>
        </form>

        {status.text && (
          <div className={`mt-5 p-4 rounded-xl border text-xs font-['JetBrains_Mono'] text-center ${
            status.type === 'success' 
              ? 'bg-green-500/10 text-green-300 border-green-500/20' 
              : 'bg-red-500/10 text-red-300 border-red-500/20'
          }`}>
            {status.text}
          </div>
        )}

        <p className="text-center text-xs text-[#c6c6cd] mt-6">
          Already mapped to the system grid? 
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline ml-1">
            Access Login
          </Link>
        </p>
      </div>
    </div>
  );
}