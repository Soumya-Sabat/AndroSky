'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Decrypting link coordinates...' });

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');

      // Verify the existence of matching entries inside your Supabase users grid
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (error) throw error;

      if (!user) {
        setTimeout(() => router.push('/register'), 2000);
        return setStatus({ type: 'error', text: 'Access Denied: Invalid quantum coordinates. Launch your Odyssey.' });
      }

      // Keep tracking session data locally
      localStorage.setItem('nebula_session', JSON.stringify(user));
      setStatus({ type: 'success', text: 'Uplink Established. Routing permissions matrix...' });

      // Dynamic Role Routing Engine
      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/adminboard');
        } else {
          router.push('/dashboard');
        }
      }, 600);

    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Authentication sequence failed.' });
    }
  };

  return (
    <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Animated Orbital Rings - Purple Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-500/10 animate-orbit-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-pink-500/10 animate-orbit-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-purple-500/5 animate-orbit-slower" />
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-purple-400/30 pointer-events-none animate-float"
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

      {/* Glowing Orbs in Corners - Purple Theme */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/10 rounded-full filter blur-[120px] animate-pulse animation-delay-2000 pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-[80px] animate-pulse animation-delay-4000 pointer-events-none" />

      {/* Shooting Stars */}
      <div className="absolute top-[20%] left-[70%] w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0 pointer-events-none" />
      <div className="absolute top-[50%] left-[15%] w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-5000 pointer-events-none" />
      <div className="absolute top-[85%] left-[60%] w-1 h-1 bg-white rounded-full animate-shooting-star opacity-0 animation-delay-8000 pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md p-6 md:p-8 rounded-3xl bg-[#131315]/60 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.08)] relative z-20">
        <div className="text-center mb-6 md:mb-8">
          {/* Animated Icon */}
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🔐</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-[#dae2fd] mb-2">
            Access Terminal
          </h3>
          <p className="text-xs md:text-sm text-[#c6c6cd]">
            Mount your operational security parameters.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] md:text-xs font-['JetBrains_Mono'] text-purple-400 uppercase tracking-widest mb-1.5 pl-1">
              Registered Sector Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50 text-lg">📧</span>
              <input 
                type="email" 
                placeholder="commander@domain.com" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-[#131315]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all placeholder-gray-500" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-['JetBrains_Mono'] text-purple-400 uppercase tracking-widest mb-1.5 pl-1">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50 text-lg">📱</span>
              <input 
                type="tel" 
                placeholder="10-digit security passcode" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-[#131315]/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all font-['JetBrains_Mono'] placeholder-gray-500" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status.type === 'loading'} 
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-['JetBrains_Mono'] text-white text-xs md:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 border-0"
          >
            {status.type === 'loading' ? 'Verifying Link...' : 'Open Connection'}
          </button>
        </form>

        {status.text && (
          <div className={`mt-5 p-4 rounded-xl border text-xs font-['JetBrains_Mono'] text-center ${
            status.type === 'success' 
              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' 
              : 'bg-red-500/10 text-red-300 border-red-500/20'
          }`}>
            {status.text}
          </div>
        )}

        <p className="text-center text-xs text-[#c6c6cd] mt-6">
          New to this corner of space? 
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium hover:underline ml-1">
            Launch Odyssey
          </Link>
          <Link href="/" className="text-purple-400 hover:text-purple-300 font-medium hover:underline ml-1">
            Back to Spaceship
          </Link>
        </p>
      </div>
    </div>
  );
}