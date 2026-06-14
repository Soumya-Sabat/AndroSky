import Link from 'next/link'

export default function PostNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--text-primary)] mb-4">error</span>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-2">Transmission Not Found</h1>
        <p className="text-[var(--text-primary)] mb-6">The transmission you're looking for doesn't exist or was removed.</p>
        <Link href="/transmission-hub" className="button-gradient px-6 py-2 rounded-lg text-white">
          Back to Transmission Hub
        </Link>
      </div>
    </div>
  )
}