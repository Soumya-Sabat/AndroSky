'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser, sendMagicLink } from '@/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setStatus({ type: 'loading', message: 'Verifying cosmic credentials...' })

    // Send magic link
    const result = await sendMagicLink(email)
    
    if (result.success) {
      setStatus({ 
        type: 'success', 
        message: 'Magic link sent! Check your email to login.' 
      })
      setIsLoading(false)
    } else {
      // If magic link fails, try login
      const loginResult = await loginUser(email)
      
      if (loginResult.success && loginResult.requiresMagicLink) {
        setStatus({ 
          type: 'success', 
          message: loginResult.message || 'Magic link sent to your email!' 
        })
        setIsLoading(false)
      } else if (loginResult.success && loginResult.session) {
        setStatus({ type: 'success', message: 'Login successful! Redirecting...' })
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setStatus({ 
          type: 'error', 
          message: loginResult.error || 'Login failed. Please try again.' 
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
          <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-cyan)] uppercase tracking-[0.2em]">Welcome Back</span>
        </div>
        <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold mb-3 text-white">
          Login to <span className="gradient-text">Androsky</span>
        </h1>
        <p className="text-[var(--text-primary)] text-sm font-['Inter']">
          Enter your email to continue your cosmic journey
        </p>
      </div>

      {/* Login Card */}
      <div className="glass rounded-3xl p-8 border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 font-['Inter']">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-primary)] text-lg">
                email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@androsky.io"
                className="w-full pl-12 pr-4 py-3 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-xl text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all font-['Inter']"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-[var(--text-primary)]/50 mt-2 font-['Inter']">
              We'll send a magic link to your email. No password needed.
            </p>
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
                Sending Magic Link...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue with Email
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
            <span className="px-3 bg-[var(--surface-low)] text-[var(--text-primary)] font-['Inter']">New to Androsky?</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] transition-colors font-['Inter'] text-sm"
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            Join the Odyssey
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
          🔐 Passwordless authentication • Magic link sent to your email • Instant access
        </p>
      </div>
    </div>
  )
}