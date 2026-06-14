// (Support/Contact Hub) 
'use client'

import { useState } from 'react'
import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import { supabase } from '@/lib/supabase'


const faqs = [
  { q: 'How do I reset my account?', a: 'Since we use passwordless authentication, simply use the "Launch Odyssey" button with your email to request a new session.' },
  { q: 'Can I export my data?', a: 'Yes! Go to Settings → Data Export to download all your tasks and progress in JSON/CSV format.' },
  { q: 'What happens if I lose my cluster code?', a: 'Contact your cluster admin to regenerate the code. They can share the new one with you.' },
  { q: 'Is there a mobile app?', a: 'Mobile apps for iOS and Android are coming in Phase 2. For now, our web app is fully responsive.' },
  { q: 'How do streaks work?', a: 'Complete at least one task every day to maintain your streak. Streaks multiply your XP rewards.' },
  { q: 'Can I delete my account?', a: 'Yes, email privacy@nebulatasks.io or use the "Delete Account" option in Settings.' },
]

export default function CommandCenterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all fields' })
      return
    }
    setStatus({ type: 'loading', message: 'Sending...' })

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name, email: formData.email, message: formData.message
      }])
      if (error) throw error
      setStatus({ type: 'success', message: 'Message sent! Our team will respond within 24 hours.' })
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus({ type: '', message: '' }), 5000)
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold mb-4 text-white">
              Command <span className="gradient-text">Center</span>
            </h1>
            <p className="text-[var(--text-variant)] text-lg max-w-2xl mx-auto font-['Inter']">
              Get help, find answers, or contact our support team. We're here to assist you.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="glass rounded-xl p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-[var(--accent-cyan)]">schedule</span>
              <div className="font-['JetBrains_Mono'] text-lg font-bold text-white mt-1">&lt; 24h</div>
              <div className="text-xs text-[var(--text-primary)]">Average Response Time</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-[var(--accent-purple)]">check_circle</span>
              <div className="font-['JetBrains_Mono'] text-lg font-bold text-white mt-1">99.9%</div>
              <div className="text-xs text-[var(--text-primary)]">Satisfaction Rate</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-[var(--accent-tertiary)]">public</span>
              <div className="font-['JetBrains_Mono'] text-lg font-bold text-white mt-1">24/7</div>
              <div className="text-xs text-[var(--text-primary)]">Support Coverage</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div className="glass rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[var(--accent-cyan)]">quiz</span>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="group border-b border-white/10 pb-3">
                    <summary className="font-['Inter'] font-medium text-white cursor-pointer hover:text-[var(--accent-cyan)] transition-colors">
                      {faq.q}
                    </summary>
                    <p className="text-[var(--text-primary)] text-sm mt-2 pl-2">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[var(--accent-purple)]">contact_support</span>
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">Send a Message</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Your name" className="w-full px-4 py-2.5 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-lg text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)]" required />
                <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Your email" className="w-full px-4 py-2.5 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-lg text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)]" required />
                <textarea name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="5" placeholder="How can we help?" className="w-full px-4 py-2.5 bg-[var(--surface-low)] border border-[var(--surface-variant)] rounded-lg text-white placeholder:text-[var(--text-primary)]/50 focus:outline-none focus:border-[var(--accent-cyan)] resize-none" required />
                <button type="submit" disabled={status.type === 'loading'} className="button-gradient w-full py-3 rounded-lg text-white font-semibold disabled:opacity-50">Send Message</button>
                {status.message && <div className={`p-3 rounded-lg text-center text-sm ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{status.message}</div>}
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}