import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Starlight Privacy Policy - NebulaTasks',
  description: 'Your privacy matters. Read how NebulaTasks protects your data with enterprise-grade security and transparency.',
}

export default function StarlightPrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1 rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 backdrop-blur-sm">
              <span className="font-['JetBrains_Mono'] text-xs text-[var(--accent-cyan)] uppercase tracking-[0.2em]">Last Updated: January 2024</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold mb-4 text-white">
              Starlight <span className="gradient-text">Privacy</span>
            </h1>
            <p className="text-[var(--text-variant)] text-lg max-w-2xl mx-auto font-['Inter']">
              Your data is yours alone. We're committed to transparency, security, and giving you control.
            </p>
          </div>

          {/* Last Updated Badge */}
          <div className="glass rounded-2xl p-4 mb-8 text-center border border-white/10">
            <p className="text-sm text-[var(--text-primary)] font-['Inter']">
              🔒 This policy complies with <strong className="text-white">GDPR (Europe)</strong>, 
              <strong className="text-white"> CCPA (California)</strong>, and 
              <strong className="text-white"> LGPD (Brazil)</strong> regulations.
            </p>
          </div>

          {/* Content */}
          <div className="glass rounded-3xl p-6 md:p-8 space-y-8 border border-white/10">
            
            {/* Section 1 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-cyan)]">info</span>
                1. Information We Collect
              </h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm leading-relaxed">
                <p><strong className="text-white">Email Address:</strong> We collect your email to create and manage your account. No passwords are stored.</p>
                <p><strong className="text-white">Task Data:</strong> Your tasks, clusters, and progress are stored to provide our core service.</p>
                <p><strong className="text-white">Usage Data:</strong> Anonymous analytics help us improve the platform.</p>
                <p><strong className="text-white">Device Information:</strong> Browser type, OS, and basic device info for performance optimization.</p>
                <div className="bg-white/5 p-4 rounded-xl mt-3">
                  <p className="text-xs text-[var(--accent-cyan)] font-['JetBrains_Mono']">✓ We DO NOT collect: Passwords, Financial data, Biometric data, or Location tracking</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-purple)]">security</span>
                2. How We Use Your Data
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-[var(--text-primary)] font-['Inter'] text-sm">
                <div className="bg-white/5 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-[var(--accent-cyan)] text-sm align-middle mr-1">check_circle</span>
                  Provide and maintain NebulaTasks
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-[var(--accent-cyan)] text-sm align-middle mr-1">check_circle</span>
                  Sync tasks across devices
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-[var(--accent-cyan)] text-sm align-middle mr-1">check_circle</span>
                  Enable cluster collaboration
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-[var(--accent-cyan)] text-sm align-middle mr-1">check_circle</span>
                  Send important service updates
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-tertiary)]">database</span>
                3. Data Storage & Security
              </h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm leading-relaxed">
                <p>• All data is encrypted at rest using AES-256 and in transit using TLS 1.3</p>
                <p>• Servers hosted on <strong className="text-white">Supabase (AWS/GCP)</strong> with ISO 27001 certification</p>
                <p>• Daily automated backups retained for 30 days</p>
                <p>• Access logs monitored 24/7 for suspicious activity</p>
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mt-3">
                  <p className="text-sm text-green-300 font-['Inter']">✅ Zero-knowledge architecture: Your tasks are encrypted and we cannot read them without your session.</p>
                </div>
              </div>
            </section>

            {/* Section 4 - GDPR Specific */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-cyan)]">gavel</span>
                4. Your Rights (GDPR/CCPA)
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-[var(--text-primary)] font-['Inter'] text-sm mb-4">
                <div className="border-l-2 border-[var(--accent-cyan)] pl-3 py-2">
                  <strong className="text-white">Right to Access</strong>
                  <p className="text-xs mt-1">Request a copy of all your data</p>
                </div>
                <div className="border-l-2 border-[var(--accent-purple)] pl-3 py-2">
                  <strong className="text-white">Right to Rectification</strong>
                  <p className="text-xs mt-1">Correct inaccurate data</p>
                </div>
                <div className="border-l-2 border-[var(--accent-tertiary)] pl-3 py-2">
                  <strong className="text-white">Right to Deletion</strong>
                  <p className="text-xs mt-1">Request permanent data removal</p>
                </div>
                <div className="border-l-2 border-[var(--accent-cyan)] pl-3 py-2">
                  <strong className="text-white">Right to Portability</strong>
                  <p className="text-xs mt-1">Export your data in JSON/CSV</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm text-[var(--text-primary)] font-['Inter']">
                  To exercise any of these rights, email <strong className="text-[var(--accent-cyan)]">privacy@nebulatasks.io</strong> 
                  or use the in-app "Data Request" feature. Responses within 30 days.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-purple)]">cookie</span>
                5. Cookies & Tracking
              </h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm leading-relaxed">
                <p>We use essential cookies only:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-white">session_token</strong> - Maintains your login session (HTTP-only, encrypted)</li>
                  <li><strong className="text-white">preferences</strong> - Stores your theme and language choices</li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mt-3">
                  <p className="text-sm text-yellow-300 font-['Inter']">🍪 No third-party tracking cookies. No Google Analytics. No Facebook pixels.</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-tertiary)]">partnership</span>
                6. Third-Party Services
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-[var(--accent-cyan)] font-['JetBrains_Mono'] text-xs">Service</th>
                      <th className="px-4 py-3 text-left text-[var(--accent-cyan)] font-['JetBrains_Mono'] text-xs">Purpose</th>
                      <th className="px-4 py-3 text-left text-[var(--accent-cyan)] font-['JetBrains_Mono'] text-xs">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr><td className="px-4 py-3 text-white">Supabase</td><td className="px-4 py-3 text-[var(--text-primary)]">Database & Auth</td><td className="px-4 py-3 text-[var(--text-primary)]">Email, tasks, metadata</td></tr>
                    <tr><td className="px-4 py-3 text-white">Vercel</td><td className="px-4 py-3 text-[var(--text-primary)]">Hosting & CDN</td><td className="px-4 py-3 text-[var(--text-primary)]">Usage analytics</td></tr>
                    <tr><td className="px-4 py-3 text-white">Resend (optional)</td><td className="px-4 py-3 text-[var(--text-primary)]">Email notifications</td><td className="px-4 py-3 text-[var(--text-primary)]">Email address only</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--accent-cyan)]">contact_support</span>
                7. Contact Us
              </h2>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[var(--text-primary)] font-['Inter'] text-sm">
                  <strong className="text-white">Data Protection Officer:</strong> Sarah Chen<br/>
                  <strong className="text-white">Email:</strong> <a href="mailto:dpo@nebulatasks.io" className="text-[var(--accent-cyan)] hover:underline">dpo@nebulatasks.io</a><br/>
                  <strong className="text-white">Address:</strong> 42 Nebula Way, San Francisco, CA 94105<br/>
                  <strong className="text-white">EU Representative:</strong> GDPR-Rep GmbH, Berlin, Germany
                </p>
              </div>
            </section>

            {/* Footer Note */}
            <div className="border-t border-white/10 pt-6 mt-6 text-center">
              <p className="text-xs text-[var(--text-primary)]/60 font-['JetBrains_Mono']">
                This policy may be updated periodically. Changes will be notified via email and in-app notification.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}