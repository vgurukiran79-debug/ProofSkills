import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  FileBadge,
  Eye,
  Lock,
  Compass,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export const LandingView: React.FC = () => {
  const { setActiveView, resetToDemo, profile, evidenceScore } = useProfile();

  const handleBuildPassport = () => {
    setActiveView('dashboard');
  };

  const handleExploreDemo = () => {
    resetToDemo();
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl opacity-70" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Quiet kicker tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>The Evidence-Based Skill Passport</span>
            <span aria-hidden="true" className="text-cyan-600">·</span>
            <span className="text-slate-300">Zero Resume Fluff</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
            Your Skills Deserve <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Proof.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed text-balance max-w-2xl mx-auto">
            Turn your skills, projects and practical knowledge into verifiable evidence.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Don't just claim your skills. Prove them with timed code assessments, commit audits, and live artifacts.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleBuildPassport}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
            >
              <span>Build My Passport</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleExploreDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-[0.98]"
            >
              <span>Explore Demo</span>
              <span className="text-xs text-cyan-400 font-mono">Alex Rivera (UWash)</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              No External API Keys Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              Recruiter-Verifiable Links
            </span>
          </div>
        </div>

        {/* Hero Interactive Passport Preview Card */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-lg">
                  {profile.name.split(' ').map(n => n[0]).join('') || 'PS'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{profile.name}</h3>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      {profile.passportId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{profile.headline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Evidence Proof Index</div>
                  <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                    {evidenceScore}/100 <span className="text-xs text-slate-400 font-normal">Ready</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('passport')}
                  className="px-3.5 py-2 text-xs font-medium text-cyan-300 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/10 transition-colors"
                >
                  Inspect Full Passport
                </button>
              </div>
            </div>

            {/* Evidence 3-Column Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Verified Skills</span>
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {profile.skills.filter(s => s.verificationStatus !== 'unverified').length} / {profile.skills.length || 0}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Backed by technical assessments & live PRs
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Project Repositories</span>
                  <GitPullRequest className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {profile.projects.length} Repos
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Audited commits, test suites & architectures
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Cryptographic Seal</span>
                  <Lock className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-300 truncate pt-2">
                  {profile.verificationHash.substring(0, 18)}...
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Tamper-evident candidate audit snapshot
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-800/60 bg-[#090e1a]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">The Verification Engine</h2>
            <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">How ProofSkill Works</h3>
            <p className="mt-3 text-slate-400 text-sm">
              Replace subjective self-ratings with verifiable evidence in four systematic steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Catalog Your Tech Stack</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add your languages, frameworks, databases, and core concepts. Define proficiency levels honestly.
              </p>
            </div>

            <div className="relative p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Pass Technical Tests</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Take rigorous multiple-choice assessments covering real edge-cases, memory leaks, and concurrency.
              </p>
            </div>

            <div className="relative p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Submit Project Evidence</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Link real GitHub PRs, system architecture diagrams, and test suite benchmarks as immutable proof.
              </p>
            </div>

            <div className="relative p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-sm mb-4">
                04
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Share Your Skill Passport</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate a permanent passport link and QR code for recruiters to review your genuine technical depth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Core Capabilities</h2>
            <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">Built for Technical Rigor</h3>
            <p className="mt-3 text-slate-400 text-sm">
              Engineered specifically for engineering students, fresh graduates, and technical recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-cyan-500/40 transition-all">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <FileBadge className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Evidence Map Matrix</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visual graph mapping every claimed skill directly to its supporting repository commits, architecture RFCs, and assessment scores.
              </p>
              <button
                onClick={() => setActiveView('evidence-map')}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>View Evidence Map</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-cyan-500/40 transition-all">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Eye className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Dedicated Recruiter Lens</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Recruiters can inspect code PR diffs, review actual assessment question answers, verify test coverage, and leave candidate feedback.
              </p>
              <button
                onClick={() => setActiveView('recruiter-view')}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>Preview Recruiter Mode</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 hover:border-cyan-500/40 transition-all">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Local Cryptographic Passport</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Full client-side persistence with LocalStorage, JSON import/export, print-to-PDF ready passports, and zero dependency on external servers.
              </p>
              <button
                onClick={() => setActiveView('passport')}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <span>Open Passport</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 border-t border-slate-800/60 bg-[#080d19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Why Proof Matters</h2>
            <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">The ProofSkill Advantage</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students & Freshers */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">For Students & Freshers</h4>
                  <p className="text-xs text-slate-400">Stand out in a sea of identical resumes</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-1 shrink-0" />
                  <span><strong>Kill the "3-5 years experience" trap:</strong> Prove you know production patterns today with concrete PRs and verified code tests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-1 shrink-0" />
                  <span><strong>Beyond College GPA:</strong> Showcase real-world architectural thinking that standard university exams fail to reflect.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-1 shrink-0" />
                  <span><strong>Single Source of Technical Truth:</strong> Put one verified ProofSkill passport link in job applications, LinkedIn, and GitHub headers.</span>
                </li>
              </ul>

              <button
                onClick={() => setActiveView('profile')}
                className="mt-8 w-full py-2.5 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
              >
                Set Up My Student Profile
              </button>
            </div>

            {/* For Technical Recruiters */}
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">For Technical Recruiters</h4>
                  <p className="text-xs text-slate-400">Zero fluff, 60-second candidate verification</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                  <span><strong>Stop guessing about candidate competence:</strong> Inspect actual commit histories, test pass rates, and PR discussions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                  <span><strong>Reduce wasted technical screening rounds:</strong> Fast-track candidates who already hold passed assessments and vetted codebases.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
                  <span><strong>Export audit summaries:</strong> Share proof reports directly with engineering hiring managers with full transparency.</span>
                </li>
              </ul>

              <button
                onClick={() => setActiveView('recruiter-view')}
                className="mt-8 w-full py-2.5 px-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
              >
                Open Recruiter Evaluation Lens
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-800/60 bg-gradient-to-b from-[#080d19] to-[#060913]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Prove Your Skills?
          </h3>
          <p className="mt-4 text-base text-slate-300">
            Build your evidence passport today. Take assessments, add project proofs, and show recruiters what you can actually build.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleBuildPassport}
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-950"
            >
              Start Your Passport Now
            </button>
            <button
              onClick={() => setActiveView('assessments')}
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              Browse Skill Assessments
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#050811] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-bold text-white">ProofSkill</span>
            <span className="text-slate-600">|</span>
            <span>Don't just claim your skills. Prove them.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => setActiveView('dashboard')} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <button onClick={() => setActiveView('assessments')} className="hover:text-white transition-colors">
              Assessments
            </button>
            <button onClick={() => setActiveView('projects')} className="hover:text-white transition-colors">
              Projects
            </button>
            <button onClick={() => setActiveView('evidence-map')} className="hover:text-white transition-colors">
              Evidence Map
            </button>
            <button onClick={() => setActiveView('passport')} className="hover:text-white transition-colors">
              Skill Passport
            </button>
            <button onClick={() => setActiveView('settings')} className="hover:text-white transition-colors">
              Settings
            </button>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            ProofSkill v1.0 · LocalStorage Persistence · No API Keys
          </div>
        </div>
      </footer>
    </div>
  );
};
