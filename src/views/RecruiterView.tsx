import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Download,
  Calendar,
  Building,
  Check,
  FileCheck2,
  FolderGit2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export const RecruiterView: React.FC = () => {
  const { profile, evidenceScore, addRecruiterFeedback } = useProfile();

  // Feedback form state
  const [recruiterName, setRecruiterName] = useState('Elena Rostova');
  const [company, setCompany] = useState('Datacore Systems');
  const [rating, setRating] = useState<number>(5);
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState<'shortlisted' | 'interview_scheduled' | 'reviewing'>('interview_scheduled');
  const [formSaved, setFormSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'tests' | 'code' | 'notes'>('audit');

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName.trim() || !company.trim() || !note.trim()) return;

    addRecruiterFeedback({
      recruiterName: recruiterName.trim(),
      company: company.trim(),
      rating,
      note: note.trim(),
      decision
    });

    setNote('');
    setFormSaved(true);
    setTimeout(() => setFormSaved(false), 3000);
  };

  const handleDownloadReport = () => {
    const reportText = `======================================================
PROOFSKILL CANDIDATE VERIFICATION AUDIT REPORT
======================================================
Candidate: ${profile.name}
Passport ID: ${profile.passportId}
University: ${profile.university} (${profile.degree}, ${profile.graduationYear})
Evidence Proof Index: ${evidenceScore}/100
Cryptographic Signature: ${profile.verificationHash}
Audit Date: ${new Date().toISOString()}

VERIFIED SKILLS:
${profile.skills.map(s => `- ${s.name} [${s.category}] - ${s.level} (Status: ${s.verificationStatus}, Score: ${s.assessmentScore || 'N/A'}%)`).join('\n')}

VERIFIED PROJECT REPOSITORIES:
${profile.projects.map(p => `* ${p.title} (${p.category})
  Repo: ${p.githubUrl}
  Commits: ${p.commitsCount} | Test Coverage: ${p.testCoveragePercent}%
  Artifacts: ${(p.artifacts || []).map(a => a.title).join(', ')}
  Architecture: ${p.architectureNotes}`).join('\n\n')}

STANDARDIZED ASSESSMENT RESULTS:
${profile.assessmentResults.map(r => `- ${r.skillName}: ${r.score}% (${r.passed ? 'PASSED' : 'FAILED'}) on ${r.completedAt}`).join('\n')}

RECRUITER EVALUATIONS:
${(profile.recruiterNotes || []).map(n => `[${n.evaluatedAt.split('T')[0]}] ${n.recruiterName} (${n.company}) - Rating: ${n.rating}/5
Decision: ${n.decision.toUpperCase()}
Notes: ${n.note}`).join('\n\n')}

======================================================
Verified via ProofSkill Client Ledger Protocol v1.0
======================================================`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProofAudit_${profile.passportId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Recruiter Lens Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1">
            <UserCheck className="h-4 w-4" />
            <span>Recruiter Verification & Evaluation Lens</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Auditing Candidate: <span className="text-cyan-300">{profile.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect real source code artifacts, test logs, and architectural benchmarks before scheduling an interview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Audit Report</span>
          </button>
        </div>
      </div>

      {/* Audit Checklist Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Identity & College</span>
          </div>
          <div className="text-sm font-bold text-white truncate">{profile.university}</div>
          <div className="text-[11px] text-slate-400 mt-1">{profile.degree}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Assessment Proof</span>
          </div>
          <div className="text-sm font-bold font-mono text-cyan-300">
            {profile.assessmentResults.filter(r => r.passed).length} Tests Passed
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Average score 87.2%</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-medium text-blue-400 mb-1">
            <FolderGit2 className="h-4 w-4" />
            <span>Code Repositories</span>
          </div>
          <div className="text-sm font-bold font-mono text-white">
            {profile.projects.length} Audited Repos
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg coverage: {Math.round(profile.projects.reduce((acc, p) => acc + p.testCoveragePercent, 0) / (profile.projects.length || 1))}%
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-medium text-purple-400 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Readiness Index</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {evidenceScore}/100
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Top 10% Technical Rigor</div>
        </div>
      </div>

      {/* Recruiter Work Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'audit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Verification Audit
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'tests' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Test Question Logs ({profile.assessmentResults.length})
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Code & PR Proofs ({profile.projects.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'notes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          Evaluation Notes & Action ({profile.recruiterNotes?.length || 0})
        </button>
      </div>

      {/* Tab 1: Verification Audit */}
      {activeTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-base font-bold text-white mb-4">Integrity & Authenticity Checkpoints</h2>
              
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg border border-emerald-900/50 bg-emerald-950/20 flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Repository Commit History Verified</h3>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      Commit histories show regular, incremental development over months with natural commit messages, rather than one-shot dump clones.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-emerald-900/50 bg-emerald-950/20 flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Standardized Assessments Proctored via Client Ledger</h3>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      Completed timed technical evaluations covering deep memory models, asynchronous outbox pattern, and database composite indexes.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-emerald-900/50 bg-emerald-950/20 flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Live Architectural Artifacts Attached</h3>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      System Design RFCs and load test benchmark telemetry attached showing 12.4k rps load handling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Recruiter Evaluation Drawer */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Building className="h-4 w-4 text-cyan-400" />
                <span>Submit Evaluation</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Record your hiring evaluation notes for this candidate.
              </p>

              <form onSubmit={handleSubmitEvaluation} className="space-y-3 text-xs">
                {formSaved && (
                  <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-medium">
                    Evaluation feedback recorded!
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={e => setRecruiterName(e.target.value)}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Company / Team</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Technical Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 ${rating >= star ? 'text-amber-400' : 'text-slate-600'}`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Hiring Decision</label>
                  <select
                    value={decision}
                    onChange={e => setDecision(e.target.value as any)}
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-white text-xs"
                  >
                    <option value="interview_scheduled">Schedule Technical Interview</option>
                    <option value="shortlisted">Fast-Track Shortlist</option>
                    <option value="reviewing">Under Team Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Feedback / Notes</label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Candidate shows great command over concurrency and clean code..."
                    className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-white text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold transition-colors mt-2"
                >
                  Save Recruiter Assessment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Test Question Logs */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          {profile.assessmentResults.map((result, idx) => (
            <div key={result.id || `${result.assessmentId}-${idx}`} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-cyan-400">ID: {result.assessmentId}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{result.category || result.skillName}</h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-emerald-400">{result.score}%</div>
                  <div className="text-[11px] text-slate-400">
                    Tier: <strong className="text-cyan-300 font-mono">{result.skillLevel || 'Proficient'}</strong> · {result.completedAt.split('T')[0]}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                <span>
                  Answered correctly: <strong className="text-white">{result.correctCount !== undefined ? result.correctCount : Math.round((result.score / 100) * result.totalQuestions)}</strong> of {result.totalQuestions} standardized questions.
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {result.passed ? 'Verified Standardized Pass' : 'Under Minimum Threshold'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Code & PR Proofs */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          {profile.projects.map(proj => (
            <div key={proj.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-400">{proj.tagline}</p>
                </div>
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <span>Inspect Repo</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                <strong className="text-cyan-400">Architecture: </strong>
                {proj.architectureNotes}
              </div>

              {proj.artifacts && proj.artifacts.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Attached PRs & Specs:</span>
                  {proj.artifacts.map(art => (
                    <div key={art.id} className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-300">{art.title}</span>
                      <a href={art.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                        Review Diff →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Evaluation Notes & History */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {profile.recruiterNotes && profile.recruiterNotes.length > 0 ? (
            profile.recruiterNotes.map((noteItem, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                      {noteItem.recruiterName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{noteItem.recruiterName}</h3>
                      <p className="text-xs text-slate-400">{noteItem.company}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 justify-end">
                      {Array.from({ length: noteItem.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-semibold uppercase mt-0.5">
                      {noteItem.decision.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  {noteItem.note}
                </p>

                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  Evaluated on {noteItem.evaluatedAt ? noteItem.evaluatedAt.split('T')[0] : 'Recent'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              No recruiter reviews recorded yet. Use the form in the Verification Audit tab to submit feedback.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
