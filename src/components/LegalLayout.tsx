import { Link } from '@tanstack/react-router'

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="text-fog min-h-screen bg-navy">
      <header className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-6 flex items-center justify-between bg-navy/80 backdrop-blur">
        <Link to="/" className="logo text-xl font-bold tracking-tight text-fog">ScaleSage</Link>
        <nav className="hidden md:flex gap-8 text-sm text-fog/70">
          <Link to="/" hash="ch1" className="hover:text-teal transition">Diagnose</Link>
          <Link to="/" hash="ch2" className="hover:text-teal transition">Build</Link>
          <Link to="/" hash="ch3" className="hover:text-teal transition">Prove</Link>
          <Link to="/" hash="ch5" className="hover:text-teal transition">Pricing</Link>
        </nav>
        <Link to="/" hash="ch7" className="nav-btn">Begin</Link>
      </header>

      <main className="max-w-3xl mx-auto px-8 md:px-16 pt-32 pb-24">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-fog/40 text-sm mb-12">Last updated: April 2026</p>
        <div className="legal-body">{children}</div>
      </main>
    </div>
  )
}
