import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ExternalLink, UserCheck } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, evidenceScore, profile } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            ProofSkill
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNav('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'dashboard' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNav('assessments')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'assessments' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Assessments
          </button>
          <button
            onClick={() => handleNav('projects')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'projects' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Project Evidence
          </button>
          <button
            onClick={() => handleNav('evidence-map')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'evidence-map' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Evidence Map
          </button>
          <button
            onClick={() => handleNav('passport')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'passport' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Skill Passport
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('recruiter-view')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              activeView === 'recruiter-view'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Inspect candidate proof as a technical recruiter"
          >
            <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Recruiter Lens</span>
          </button>

          <button
            onClick={() => handleNav(activeView === 'landing' ? 'dashboard' : 'passport')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
          >
            {activeView === 'landing' ? 'Open Dashboard' : 'Share Passport'}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0b1120] px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span>Signed in as <strong className="text-white">{profile.name}</strong></span>
            <span className="font-mono text-cyan-400 font-semibold">{evidenceScore}% Proof Score</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNav('dashboard')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'dashboard' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNav('assessments')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'assessments' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Assessments
            </button>
            <button
              onClick={() => handleNav('projects')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'projects' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => handleNav('evidence-map')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'evidence-map' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Evidence Map
            </button>
            <button
              onClick={() => handleNav('passport')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'passport' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Skill Passport
            </button>
            <button
              onClick={() => handleNav('profile')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'profile' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Student Profile
            </button>
            <button
              onClick={() => handleNav('recruiter-view')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'recruiter-view' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Recruiter View
            </button>
            <button
              onClick={() => handleNav('settings')}
              className={`p-2.5 text-left text-sm rounded-lg font-medium ${
                activeView === 'settings' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNav('landing')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-white"
            >
              <span>Back to Landing Page</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
