"use client"
export default function Footer() {
  return (
    <footer className="bg-[#0e0e10] w-full py-16 border-t border-[#353436]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-center px-6 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col gap-2">
          <a href="/" className="font-['Space_Grotesk'] text-xl font-bold text-[#bec6e0]">NebulaTasks</a>
          <p className="font-['Inter'] text-sm text-[#c6c6cd] max-w-xs">
            © {new Date().getFullYear()} NebulaTasks. All rights reserved. Across the Multiverse.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <a className="text-sm text-[#c6c6cd] hover:text-[#c4c1fb] hover:underline transition-colors" href="/privacy">Starlight Privacy</a>
          <a className="text-sm text-[#c6c6cd] hover:text-[#c4c1fb] hover:underline transition-colors" href="/command-center">Command Center</a>
          <a className="text-sm text-[#c6c6cd] hover:text-[#c4c1fb] hover:underline transition-colors" href="/terms">Cosmic Terms</a>
          <a className="text-sm text-[#c6c6cd] hover:text-[#c4c1fb] hover:underline transition-colors" href="/transmission-hub">Transmission Hub</a>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[#bec6e0] transition-all cursor-pointer text-white">
            <span className="material-symbols-outlined text-sm">share</span>
          </div>
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[#bec6e0] transition-all cursor-pointer text-white">
            <span className="material-symbols-outlined text-sm">hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
}