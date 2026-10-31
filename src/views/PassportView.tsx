import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Printer,
  Share2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  GitPullRequest,
  Check,
  Lock,
  QrCode,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { VerificationBadge } from '../components/Common/VerificationBadge';

export const PassportView: React.FC = () => {
  const { profile, evidenceScore, setActiveView } = useProfile();
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const passportUrl = `${window.location.origin}/passport/${profile.passportId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Action Bar (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            Public Skill Credential
          </span>
          <h1 className="text-lg font-bold text-white">Official Skill Passport</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Passport URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => setActiveView('recruiter-view')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Recruiter Lens</span>
          </button>
        </div>
      </div>

      {/* The Printable Official Passport Document */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1c] p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-slate-300 print:bg-white print:text-slate-900">
        
        {/* Holographic Header Band */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500" />

        {/* Passport Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-800/80 print:border-slate-300">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-2xl print:border-slate-400 print:text-slate-900">
              {profile.name.split(' ').map(n => n[0]).join('') || 'PS'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white print:text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[11px] font-mono text-cyan-300 print:bg-slate-100 print:text-slate-800">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                  <span>Verified</span>
                </div>
              </div>

              <p className="text-sm text-cyan-300 font-medium mt-1 print:text-slate-700">
                {profile.headline}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 print:text-slate-600">
                <span>{profile.university}</span>
                <span>·</span>
                <span>{profile.degree} ({profile.graduationYear})</span>
                <span>·</span>
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Verification Hash Stamp */}
          <div className="sm:text-right shrink-0 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Passport ID</div>
            <div className="text-sm font-mono font-bold text-white print:text-slate-900">{profile.passportId}</div>
            
            <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">Proof Score</div>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 print:text-blue-600 tabular-nums">
              {evidenceScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="py-6 border-b border-slate-800/80 print:border-slate-300 text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            {profile.bio}
          </div>
        )}

        {/* Links Bar */}
        <div className="py-4 border-b border-slate-800/80 print:border-slate-300 flex flex-wrap items-center gap-4 text-xs">
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white print:text-slate-800"
            >
              <Github className="h-3.5 w-3.5 text-cyan-400" />
              <span>GitHub Profile</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white print:text-slate-800"
            >
              <Linkedin className="h-3.5 w-3.5 text-cyan-400" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          )}
          {profile.portfolioUrl && (
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white print:text-slate-800"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Portfolio / Live Site</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          )}
        </div>

        {/* Section: Verified Skills Matrix */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-800 flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>Verified Technical Skills</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {profile.skills.filter(s => s.verificationStatus !== 'unverified').length} of {profile.skills.length} verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.skills.map(skill => (
              <div
                key={skill.id}
                className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40 print:bg-slate-50 print:border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white print:text-slate-900">{skill.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {skill.category} · {skill.level}
                  </div>
                </div>

                <VerificationBadge status={skill.verificationStatus} score={skill.assessmentScore} />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Verified Project Evidence */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-800 flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-blue-400" />
              <span>Project Evidence Ledger</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {profile.projects.length} verified repositories
            </span>
          </div>

          <div className="space-y-4">
            {profile.projects.map(proj => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 print:bg-slate-50 print:border-slate-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white print:text-slate-900">{proj.title}</h3>
                    <span className="text-[11px] text-cyan-400 font-mono font-medium">({proj.category})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>Repository</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed mb-3">
                  {proj.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 print:text-slate-600 pt-2 border-t border-slate-800/60 print:border-slate-200">
                  <div>Commits: <strong className="text-white print:text-slate-900">{proj.commitsCount}</strong></div>
                  <div>Test Coverage: <strong className="text-cyan-400 print:text-blue-600">{proj.testCoveragePercent}%</strong></div>
                  <div>Artifacts: <strong className="text-white print:text-slate-900">{proj.artifacts?.length || 0} PRs/Docs</strong></div>
                  <div>Status: <strong className="text-emerald-400">Audited</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Standardized Test Certifications */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 print:text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Passed Standardized Assessments</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.assessmentResults.filter(r => r.passed).map((r, i) => (
              <div
                key={r.id || `${r.assessmentId}-${i}`}
                className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40 print:bg-slate-50 print:border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white print:text-slate-900">{r.category || r.skillName}</div>
                  <div className="text-[11px] text-slate-400">
                    Tier: <strong className="text-cyan-400 print:text-blue-600 font-mono">{r.skillLevel || 'Proficient'}</strong> · {r.completedAt.split('T')[0]}
                  </div>
                </div>

                <div className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                  {r.score}% Pass
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic Seal & Verification Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Digital Signature: {profile.verificationHash}</span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            ProofSkill Protocol v1.0 · Issued for Candidate Verification
          </div>
        </div>
      </div>
    </div>
  );
};
