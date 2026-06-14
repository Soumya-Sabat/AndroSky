import Navbar from '@/component/landing/Navbar'
import Footer from '@/component/landing/Footer'

export const metadata = {
  title: 'Cosmic Terms of Service - AndroSky',
  description: 'Terms of service governing your use of AndroSky. Fair, transparent, and legally compliant.',
}

export default function CosmicTermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold mb-4 text-white">
              Cosmic <span className="gradient-text">Terms</span>
            </h1>
            <p className="text-[var(--text-variant)] text-lg max-w-2xl mx-auto font-['Inter']">
              By using AndroSky, you agree to these terms. Please read them carefully.
            </p>
          </div>

          {/* Compliance Badge */}
          <div className="glass rounded-2xl p-4 mb-8 text-center border border-white/10">
            <p className="text-sm text-[var(--text-primary)] font-['Inter']">
              ⚖️ Compliant with <strong className="text-white">US (CCPA, COPPA)</strong>, 
              <strong className="text-white"> EU (GDPR)</strong>, 
              <strong className="text-white"> UK (Data Protection Act)</strong>, and
              <strong className="text-white"> International Trade Laws</strong>
            </p>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 space-y-8 border border-white/10">
            
            {/* Section 1 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-[var(--text-primary)] font-['Inter'] text-sm leading-relaxed">
                By accessing or using AndroSky ("the Service"), you agree to be bound by these Terms of Service. 
                If you disagree with any part, you may not access the Service. These terms constitute a legally binding 
                agreement between you ("User") and AndroSky ("Company").
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">2. Eligibility</h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm">
                <p>• You must be at least <strong className="text-white">13 years old</strong> to use AndroSky (or 16 in the EU)</p>
                <p>• If you are under 18, you confirm that you have parental/guardian consent</p>
                <p>• You represent that you are not located in a country subject to US embargo</p>
                <p>• You are not listed on any prohibited party list</p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mt-3">
                  <p className="text-sm text-yellow-300 font-['Inter']">⚠️ Accounts created by bots or automated methods are strictly prohibited.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm">
                <p>• You are responsible for safeguarding your email account used with AndroSky</p>
                <p>• You are responsible for all activity under your account</p>
                <p>• You must immediately notify us of any unauthorized use</p>
                <p>• We reserve the right to suspend accounts violating these terms</p>
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mt-3">
                  <p className="text-sm text-blue-300 font-['Inter']">🔐 Passwordless Authentication: Since we don't store passwords, your email security is your responsibility.</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="text-[var(--text-primary)] font-['Inter'] text-sm mb-3">You agree NOT to:</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300">❌ Use the Service for illegal activities</div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300">❌ Upload malicious code or viruses</div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300">❌ Harass, abuse, or harm others</div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300">❌ Attempt to bypass security measures</div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300">❌ Scrape or crawl the Service without permission</div>
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300">❌ Reverse engineer our platform</div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm">
                <p>• AndroSky, the logo, and all original content are property of the Company</p>
                <p>• You retain ownership of your task data and content</p>
                <p>• You grant us a license to host and display your content to provide the Service</p>
                <p>• You may not copy, modify, or distribute our code or design without permission</p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">6. Subscription & Payments</h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm">
                <p>• AndroSky offers a Free Tier with basic features</p>
                <p>• Premium features are unlocked through level progression, not direct payment</p>
                <p>• Future paid plans (if introduced) will be communicated 30 days in advance</p>
                <p>• You may cancel your account at any time</p>
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mt-3">
                  <p className="text-sm text-green-300">💰 Current Model: Free. No credit card required. We believe productivity should be accessible to all.</p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">7. Data & Privacy</h2>
              <p className="text-[var(--text-primary)] font-['Inter'] text-sm">
                Your privacy is critically important. Our <a href="/privacy" className="text-[var(--accent-cyan)] hover:underline">Starlight Privacy Policy </a> 
                explains how we collect, use, and protect your data. By using AndroSky, you consent to our data practices 
                as described in the Privacy Policy.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">8. Termination</h2>
              <p className="text-[var(--text-primary)] font-['Inter'] text-sm">
                We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms. 
                Upon termination, your right to use the Service will cease immediately. You can also delete your account at any time 
                via Settings → Delete Account. Data deletion requests are processed within 30 days.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <div className="space-y-3 text-[var(--text-primary)] font-['Inter'] text-sm">
                <p>• The Service is provided "AS IS" without warranties of any kind</p>
                <p>• We are not liable for any indirect, incidental, or consequential damages</p>
                <p>• Our total liability shall not exceed the amount paid (if any) in the past 12 months</p>
                <p>• We do not guarantee uninterrupted or error-free service</p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">10. Governing Law & Dispute Resolution</h2>
              <p className="text-[var(--text-primary)] font-['Inter'] text-sm leading-relaxed">
                These Terms shall be governed by the laws of the State of California, without regard to conflict of law provisions. 
                Any disputes arising from these Terms shall be resolved through binding arbitration in San Francisco, CA, 
                in accordance with the rules of the American Arbitration Association.
              </p>
              <div className="bg-white/5 p-4 rounded-xl mt-4">
                <p className="text-xs text-[var(--text-primary)] font-['JetBrains_Mono']">
                  For EU residents: You may bring claims in your local courts under applicable consumer protection laws.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-[var(--text-primary)] font-['Inter'] text-sm">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email 
                and in-app notification at least 30 days before they take effect. Your continued use after changes constitutes 
                acceptance of the new Terms.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[var(--text-primary)] font-['Inter'] text-sm">
                  <strong className="text-white">Legal Entity:</strong> AndroSky, Inc.<br/>
                  <strong className="text-white">Registered Address:</strong> 548 Market St, PMB 90543, San Francisco, CA 94104<br/>
                  <strong className="text-white">Legal Inquiries:</strong> <a href="mailto:legal@nebulatasks.io" className="text-[var(--accent-cyan)] hover:underline">legal@nebulatasks.io</a><br/>
                  <strong className="text-white">DMCA Agent:</strong> copyright@nebulatasks.io
                </p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-6 mt-6 text-center">
              <p className="text-xs text-[var(--text-primary)]/60 font-['JetBrains_Mono']">
                Version 1.2 | Last Updated: January 2024 | <a href="#" className="hover:text-[var(--accent-cyan)]">Archive of Previous Terms</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}