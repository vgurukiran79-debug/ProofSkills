import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  FolderGit2,
  Network,
  CreditCard,
  Settings as SettingsIcon,
  User,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, profile, evidenceScore } = useProfile();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: CheckCircle2,
      badge: `${profile.assessmentResults.filter(r => r.passed).length} Passed`
    },
    {
      id: 'projects',
      label: 'My Projects',
      icon: FolderGit2,
      badge: `${profile.projects.length} Verified`
    },
    {
      id: 'evidence-map',
      label: 'Evidence Map',
      icon: Network,
      badge: undefined
    },
    {
      id: 'passport',
      label: 'Skill Passport',
      icon: CreditCard,
      badge: 'Live'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: undefined
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800 bg-[#070b14]/70 min-h-[calc(100vh-4rem)] p-4 select-none">
      {/* Student Profile Quick Peek */}
      <div className="mb-6 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 transition-all hover:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-sm">
            {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'PS'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-white truncate">{profile.name}</h2>
            <p className="text-xs text-slate-400 truncate">{profile.university || 'Student'}</p>
          </div>
          <button
            onClick={() => setActiveView('profile')}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
            title="Edit Profile"
          >
            <User className="h-4 w-4" />
          </button>
        </div>

        {/* Readiness Meter */}
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Evidence Proof Score</span>
            <span className="font-mono font-semibold text-cyan-400 tabular-nums">{evidenceScore}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${evidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
        Platform Navigation
      </div>
      <nav className="space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Recruiter View Shortcut */}
      <div className="mt-8 pt-4 border-t border-slate-800/80">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Auditing & Verification
        </div>
        <button
          onClick={() => setActiveView('recruiter-view')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === 'recruiter-view'
              ? 'bg-blue-600/15 text-blue-300 border border-blue-500/40'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <UserCheck className="h-4 w-4 text-cyan-400" />
            <span>Recruiter Lens</span>
          </div>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveView('landing')}
          className="mt-2 w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>View Public Landing</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      {/* Bottom Passport Seal Info */}
      <div className="mt-auto pt-6 text-xs text-slate-500 px-2 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono text-[11px] truncate">Passport ID: {profile.passportId}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Cryptographically hashed proof ledger. Local persistence enabled.
        </p>
      </div>
    </aside>
  );
};
