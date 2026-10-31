import React, { useState, useMemo } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Award,
  FolderGit2,
  CheckCircle2,
  FileCheck2,
  QrCode as QrCodeIcon,
  ShieldCheck,
  Calendar,
  Lock,
  X,
  Share2
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { VerificationBadge } from '../components/Common/VerificationBadge';
import { SkillLevelBadge } from '../components/Common/SkillLevelBadge';
import { generateLocalQRCodeSVG } from '../utils/qrCode';
import { downloadSkillPassportPDF } from '../utils/pdfGenerator';

export const PassportView: React.FC = () => {
  const { profile, evidenceScore, setActiveView } = useProfile();
  
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const passportUrl = `${window.location.origin}/passport/${profile.passportId}`;
  const generationDate = profile.passportGeneratedDate || '2026-10-31';

  // Generate QR code locally (pure SVG, 0 external APIs)
  const qrSvg = useMemo(() => {
    return generateLocalQRCodeSVG(passportUrl, 160, '#06b6d4', '#070b14');
  }, [passportUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadSkillPassportPDF(profile, evidenceScore);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Action Header Strip (Hidden during Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#090e1c]/90 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Recruiter-Ready Document
            </span>
            <span>·</span>
            <span>ID: {profile.passportId}</span>
          </div>
          <h1 className="text-lg font-bold text-white mt-0.5">Official Skill Passport</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm cursor-pointer"
            title="Download PDF document locally in browser without external APIs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Print or Save via System PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Passport</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="View Local Verification QR Code"
          >
            <QrCodeIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>QR Code</span>
          </button>
        </div>
      </div>

      {/* Official Skill Passport Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1c] p-6 sm:p-10 shadow-2xl relative overflow-hidden print:border-slate-300 print:bg-white print:text-slate-900">
        
        {/* Holographic Header Band */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500" />

        {/* Passport Top Banner */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-8 border-b border-slate-800/80 print:border-slate-300">
          <div className="flex items-start gap-4">
            {/* Student Avatar / Initials */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-16 w-16 rounded-2xl object-cover border border-cyan-500/40"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-2xl print:border-slate-400 print:text-slate-900 shrink-0">
                {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'PS'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white print:text-slate-900 tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800 print:bg-slate-100 print:text-slate-800">
                  {profile.passportId}
                </span>
              </div>

              <p className="text-sm font-medium text-cyan-300 print:text-slate-700 mt-1">
                {profile.headline}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-2 print:text-slate-600">
                <span>College: <strong className="text-slate-200 print:text-slate-900">{profile.college || profile.university}</strong></span>
                <span>·</span>
                <span>Course: <strong className="text-slate-200 print:text-slate-900">{profile.course || profile.degree}</strong></span>
                <span>·</span>
                <span>Class of {profile.graduationYear}</span>
              </div>

              <div className="text-xs text-slate-500 mt-1">
                <span>Passport Generated: <strong className="text-slate-400 font-mono">{generationDate}</strong></span>
                {profile.location && <span> · {profile.location}</span>}
              </div>
            </div>
          </div>

          {/* Evidence Score & Local QR Code */}
          <div className="flex items-center gap-4 self-end md:self-auto bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 print:bg-slate-50 print:border-slate-300 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Proof Score</div>
              <div className="text-3xl font-mono font-extrabold text-cyan-400 print:text-blue-600 tabular-nums my-0.5">
                {evidenceScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">
                {evidenceScore >= 80 ? 'Production Ready' : 'In Progress'}
              </div>
            </div>

            {/* Local QR Code SVG Embed */}
            <div
              className="h-16 w-16 overflow-hidden rounded-lg border border-slate-800 print:border-slate-400 shrink-0"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
              title="Locally generated verification QR code"
            />
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="py-5 border-b border-slate-800/80 print:border-slate-300 text-xs sm:text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            {profile.bio}
          </div>
        )}

        {/* Links Strip */}
        <div className="py-3.5 border-b border-slate-800/80 print:border-slate-300 flex flex-wrap items-center gap-4 text-xs font-medium">
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
              <span>LinkedIn</span>
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
              <span>Portfolio Site</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          )}
        </div>

        {/* Section 1: Standardized Assessment Scores */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-800 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-blue-400" />
              <span>Standardized Technical Assessments</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Passing Mark: 70%
            </span>
          </div>

          {profile.assessmentResults.filter(r => r.passed).length === 0 ? (
            <p className="text-xs text-slate-500">No standardized assessments passed yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.assessmentResults.filter(r => r.passed).map((r, i) => (
                <div
                  key={r.id || `${r.assessmentId}-${i}`}
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 print:bg-slate-50 print:border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white print:text-slate-900">
                      {r.category || r.skillName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <SkillLevelBadge level={r.skillLevel} />
                      <span>·</span>
                      <span>Assessed: {r.completedAt.split('T')[0]}</span>
                    </div>
                  </div>

                  <div className="font-mono text-sm font-bold text-emerald-400 print:text-emerald-700 tabular-nums">
                    {r.score} / 100
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Verified Project Evidence */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-800 flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              <span>Project Evidence Ledger (Repositories & Live Code)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {profile.projects.length} Repositories
            </span>
          </div>

          <div className="space-y-4">
            {profile.projects.map(proj => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 print:bg-slate-50 print:border-slate-200 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white print:text-slate-900">{proj.title}</h3>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                      ({proj.evidenceType || proj.category})
                    </span>
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

                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {proj.description}
                </p>

                {/* Technologies and Skills */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 border-t border-slate-800/60 print:border-slate-200">
                  <div>
                    <span className="text-slate-500 mr-1.5 font-mono">Technologies:</span>
                    <strong className="text-slate-300 print:text-slate-900 font-mono">
                      {(proj.technologies && proj.technologies.length > 0) ? proj.technologies.join(', ') : proj.skillsProved.join(', ')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 mr-1.5 font-mono">Demonstrated:</span>
                    <strong className="text-cyan-400 print:text-blue-600 font-medium">
                      {(proj.skillsDemonstrated || proj.skillsProved || []).join(', ')}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Technical Skills & Official Verification Labels */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-800 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Skills Catalog & Verification Labels</span>
            </h2>
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
              <span className="text-cyan-400">Cyan: Project Evidence</span>
              <span className="text-blue-400">Blue: Assessed</span>
              <span className="text-slate-400">Grey: Self-Reported</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.skills.map(skill => {
              // Determine official label
              const hasProject = profile.projects.some(p =>
                (skill.linkedProjectIds || []).includes(p.id) ||
                (p.skillsDemonstrated || p.skillsProved || []).some(s => s.toLowerCase() === skill.name.toLowerCase())
              );
              const hasAssessment = skill.assessmentScore !== undefined;

              const labelStatus = hasProject
                ? 'project_evidence'
                : hasAssessment
                ? 'assessment_completed'
                : 'self_reported';

              return (
                <div
                  key={skill.id}
                  className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 print:bg-slate-50 print:border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white print:text-slate-900">{skill.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {skill.category} · Level: <strong className="text-slate-300 print:text-slate-900">{skill.level}</strong>
                    </div>
                  </div>

                  <VerificationBadge status={labelStatus} score={skill.assessmentScore} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Disclaimer & Cryptographic Seal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Digital Signature: {profile.verificationHash}</span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center sm:text-right">
            ProofSkill Protocol · Evidence Verified via Code & Standardized Tests
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0c1222] p-6 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCodeIcon className="h-4 w-4 text-cyan-400" />
                <span>Verification QR Code</span>
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="mx-auto w-44 h-44 rounded-xl border border-slate-800 p-2 bg-[#070b14] flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />

            <div className="text-xs text-slate-300">
              <p className="font-semibold text-white">{profile.name}</p>
              <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{profile.passportId}</p>
              <p className="text-[11px] text-slate-500 mt-2">
                Scan with any mobile camera to view this verifiable Skill Passport in browser. Generated 100% locally.
              </p>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
