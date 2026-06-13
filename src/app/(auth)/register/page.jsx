'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

    const tags = [
    "Next-Gen Task Management",
    "Orchestrate Your Clusters",
    "Zero-Knowledge Privacy",
    "AI-Powered Navigation",
    "Gamified Productivity Hub",
    "Quantum Flow Soundscapes",
    "Sync Across the Fleet"
  ];
  const [currentTagIndex, setCurrentTagIndex] = useState(0);
  const [isFade, setIsFade] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        // Start fade out slightly before changing text
        setIsFade(true);
        
        setTimeout(() => {
          setCurrentTagIndex((prevIndex) => (prevIndex + 1) % tags.length); // the array will never overflow
          setIsFade(false);
        }, 300); // This matches our transition duration
  
      }, 1200); // Swaps text roughly every second including animation buffer
  
      return () => clearInterval(interval);
    }, [tags.length]);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    agreeTerms: false
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email) {
      setStatus({ type: 'error', message: 'Please enter your email address' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' })
      return
    }

    if (!formData.username) {
      setStatus({ type: 'error', message: 'Please choose a commander name' })
      return
    }

    if (formData.username.length < 3) {
      setStatus({ type: 'error', message: 'Username must be at least 3 characters' })
      return
    }

    if (!formData.agreeTerms) {
      setStatus({ type: 'error', message: 'Please agree to the Cosmic Terms' })
      return
    }

    setIsLoading(true)
    setStatus({ type: 'loading', message: 'Launching your odyssey...' })

    // Simulate API call - Will connect to Supabase auth
    setTimeout(() => {
      setIsLoading(false)
      setStatus({ type: 'success', message: 'Account created! Redirecting to your dashboard...' })
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }, 1500)
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-purple)]/30 bg-[var(--accent-purple)]/10 backdrop-blur-sm">
          <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-purple)] uppercase tracking-[0.2em]">Join the Fleet</span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold mb-3 text-white">
          Launch Your <span className="gradient-text">Odyssey</span>
        </h1>
        <p className="text-[var(--text-primary)] text-sm font-['Inter']">
          Begin your cosmic productivity journey with Androsky
        </p>
      </div>

      {/* Registration Card */}
      <div className="glass rounded-3xl p-8 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-['Inter']">
              Email Address <span className="text-[var(--accent-cyan)]">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-lg">
                email
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="commander@androsky.io"
                className="w-full pl-12 pr-4 py-3 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-xl text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all font-['Inter']"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-['Inter']">
              Commander Name <span className="text-[var(--accent-cyan)]">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-lg">
                person
              </span>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Star Commander"
                className="w-full pl-12 pr-4 py-3 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-xl text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all font-['Inter']"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-[var(--text-primary)]/50 mt-2 font-['Inter']">
              This will be your public name across Androsky
            </p>
          </div>

          {/* Benefits Section */}
          {/* <div className="bg-[var(--surface-low)]/50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-['JetBrains_Mono'] text-[var(--accent-cyan)] mb-2">✨ Upon joining, you'll get:</p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
              <span className="material-symbols-outlined text-sm text-[var(--accent-cyan)]">check_circle</span>
              <span>Free forever personal realm</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
              <span className="material-symbols-outlined text-sm text-[var(--accent-cyan)]">check_circle</span>
              <span>100 Nebula Coins starter bonus</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
              <span className="material-symbols-outlined text-sm text-[var(--accent-cyan)]">check_circle</span>
              <span>Access to all basic missions</span>
            </div>
          </div> */}

          {/* Terms Agreement */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-[var(--surface-variant)] bg-[var(--surface-low)] text-[var(--accent-cyan)] focus:ring-[var(--accent-cyan)] focus:ring-offset-0"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-xs text-[var(--text-primary)] font-['Inter'] leading-relaxed">
              I agree to the <Link href="/terms" className="text-[var(--accent-cyan)] hover:underline">Cosmic Terms of Service</Link> and 
              <Link href="/privacy" className="text-[var(--accent-cyan)] hover:underline ml-1">Starlight Privacy Policy</Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 button-gradient rounded-xl text-white font-['Space_Grotesk'] font-semibold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Launching...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                Launch Your Odyssey
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[var(--surface-low)] text-[var(--text-primary)] font-['Inter']">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors font-['Inter'] text-sm"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            Return to Login
          </Link>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`mt-6 p-3 rounded-xl text-center text-sm font-['Inter'] transition-all ${
            status.type === 'success' 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : status.type === 'error'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30'
          }`}>
            {status.message}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="text-center mt-6">
        <p className="text-xs text-[var(--text-primary)]/40 font-['JetBrains_Mono']">
          🚀 Passwordless • No credit card required • Start for free
        </p>
      </div>
    </div>
  )
}