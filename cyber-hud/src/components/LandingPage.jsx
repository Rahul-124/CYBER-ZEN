import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-gray-100 flex flex-col justify-between overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 flex justify-between items-center border-b border-gray-800/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center font-mono font-bold text-black text-sm">
            CZ
          </div>
          <span className="text-lg font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            CYBER ZEN
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link 
            to="/demo" 
            className="text-xs tracking-wider uppercase text-gray-400 hover:text-emerald-400 transition-colors"
          >
            Live Demo
          </Link>
          <Link 
            to="/login" 
            className="text-xs tracking-wider uppercase px-4 py-2 border border-gray-700 hover:border-emerald-500 text-gray-200 hover:text-emerald-400 rounded transition-all"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs tracking-widest uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Astronomical Engine Active
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
          Productivity synchronized with the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Cosmic Clock
          </span>
        </h1>

        <p className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed font-light">
          Most task managers are sterile lists. Cyber Zen pairs priority task matrices with
          real-time Vedic astronomical calculations, adapting your schedule to cosmic flow states.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            to="/demo"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-widest uppercase rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            Launch Instant Demo (Zero Sign-Up)
          </Link>
          <Link 
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-[#121318] hover:bg-[#181a22] border border-gray-800 text-gray-300 font-semibold text-xs tracking-widest uppercase rounded-lg transition-all"
          >
            Sign In to Cloud Hub →
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
          <div className="p-6 bg-[#0e0f13] border border-gray-800/80 rounded-xl">
            <div className="text-emerald-400 text-xl mb-3">🪐</div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-2">Vedic Time Signal</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Calculates daily planetary hours and Rahu Kaal intervals via native Python astronomical routines.
            </p>
          </div>

          <div className="p-6 bg-[#0e0f13] border border-gray-800/80 rounded-xl">
            <div className="text-cyan-400 text-xl mb-3">⚡</div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-2">Matrix Focus Engine</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Distraction-free, hardware-accelerated Pomodoro timer bound directly to active high-priority objectives.
            </p>
          </div>

          <div className="p-6 bg-[#0e0f13] border border-gray-800/80 rounded-xl">
            <div className="text-emerald-400 text-xl mb-3">🛡️</div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase mb-2">Decoupled Architecture</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Vite SPA frontend paired with Django REST Framework and persistent Neon PostgreSQL clustering.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 border-t border-gray-800/40 text-center text-xs text-gray-600">
        CYBER ZEN SYSTEM // MIT LICENSE // CONTINUOUS INTEGRATION VERIFIED
      </footer>
    </div>
  );
}