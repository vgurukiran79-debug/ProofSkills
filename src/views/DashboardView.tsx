import React from 'react';
import {
  CheckCircle2,
  FolderGit2,
  Award,
  ArrowRight,
  Plus,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Clock,
  Sparkles,
  GitCommit,
  UserCheck
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { VerificationBadge } from '../components/Common/VerificationBadge';
import { ASSESSMENTS } from '../data/mockData';

export const DashboardView: React.FC = () => {
  const { profile, evidenceScore, setActiveView, setActiveAssessmentId } = useProfile();

  const verifiedSkillsCount = profile.skills.filter(s => s.verificationStatus !== 'unverified').length;
  const passedAssessmentsCount = profile.assessmentResults.filter(r => r.passed).length;
  const recruiterNotesCount = profile.recruiterNotes?.length || 0;

  // Group skills by category for strength bars
  const categories: Array<'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Algorithms' | 'System Design' | 'AI / ML'> = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Algorithms',
    'System Design',
    'AI / ML'
  ];

  const categoryStats = categories.map(cat => {
    const catSkills = profile.skills.filter(s => s.category === cat);
    const verified = catSkills.filter(s => s.verificationStatus !== 'unverified').length;
    const total = catSkills.length;
    const percent = total > 0 ? Math.round((verified / total) * 100) : 0;
    return { name: cat, total, verified, percent };
  });

  const handleStartAssessment = (assessmentId: string) => {
    setActiveAssessmentId(assessmentId);
    setActiveView('assessments');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Student Dashboard</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">{profile.passportId}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {profile.name}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {profile.university} · {profile.degree} (Class of {profile.graduationYear})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('assessments')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-xs shadow-cyan-950"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Take Assessment</span>
          </button>
          <button
            onClick={() => setActiveView('projects')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <FolderGit2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Add Project Evidence</span>
          </button>
          <button
            onClick={() => setActiveView('passport')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/80 rounded-lg transition-colors"
          >
            <span>View Passport</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Evidence Score Card */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-medium text-slate-300">Proof Index</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-300 tabular-nums">
              {evidenceScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${evidenceScore}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {evidenceScore >= 80 ? 'Exceptional evidence depth' : 'Add PRs & tests to reach 85+'}
          </p>
        </div>

        {/* Verified Skills Card */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-medium text-slate-300">Verified Skills</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {verifiedSkillsCount}
            </span>
            <span className="text-xs text-slate-400">/ {profile.skills.length} claimed</span>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            {profile.skills.length - verifiedSkillsCount} pending proof link
          </p>
        </div>

        {/* Project Evidence Card */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-medium text-slate-300">Project Repositories</span>
            <FolderGit2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {profile.projects.length}
            </span>
            <span className="text-xs text-slate-400">active repos</span>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            {profile.projects.reduce((acc, p) => acc + (p.artifacts?.length || 0), 0)} linked proof artifacts
          </p>
        </div>

        {/* Recruiter Endorsements Card */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-medium text-slate-300">Recruiter Reviews</span>
            <UserCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {recruiterNotesCount}
            </span>
            <span className="text-xs text-slate-400">evaluations</span>
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            {passedAssessmentsCount} standardized test certifications
          </p>
        </div>
      </div>

      {/* Empty State for Fresh Users */}
      {profile.skills.length === 0 && profile.projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-8 text-center max-w-2xl mx-auto">
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Your Skill Passport is Empty</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Start building your proof ledger. Add your core languages, take technical assessments, and link your GitHub repositories to prove your skills.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('profile')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Add My First Skills
            </button>
            <button
              onClick={() => setActiveView('assessments')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Take Assessment
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Split: Skill Verification Distribution & Recommended Next Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Skill Verification Matrix & Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Mastery Progress */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-white">Verification by Technical Domain</h2>
                <p className="text-xs text-slate-400">Ratio of claimed skills backed by code & tests</p>
              </div>
              <button
                onClick={() => setActiveView('evidence-map')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Evidence Map</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-4">
              {categoryStats.map(cat => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{cat.name}</span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {cat.verified} / {cat.total} verified ({cat.percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.percent >= 80 ? 'bg-cyan-400' : cat.percent > 0 ? 'bg-blue-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.max(4, cat.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Verified Skills Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Verified Skill Ledger</h2>
                <p className="text-xs text-slate-400">Skills with verifiable test scores or project linkages</p>
              </div>
              <button
                onClick={() => setActiveView('profile')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Manage All ({profile.skills.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {profile.skills.slice(0, 6).map(skill => (
                <div key={skill.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{skill.name}</span>
                      <span className="text-xs text-slate-500 font-mono">({skill.category})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>Level: {skill.level}</span>
                      {skill.linkedProjectIds && skill.linkedProjectIds.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-blue-400">{skill.linkedProjectIds.length} projects linked</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <VerificationBadge status={skill.verificationStatus} score={skill.assessmentScore} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Assessments & Recommended Steps */}
        <div className="space-y-6">
          
          {/* Quick Assessment Launchpad */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-cyan-400" />
                <span>Available Assessments</span>
              </h2>
              <button
                onClick={() => setActiveView('assessments')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                View All
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Pass timed assessments to earn verification stamps and boost your proof score.
            </p>

            <div className="space-y-2.5">
              {ASSESSMENTS.slice(0, 6).map(assessment => {
                const latestResult = profile.assessmentResults.find(
                  r => r.category.toLowerCase() === assessment.category.toLowerCase() ||
                       r.skillName.toLowerCase() === assessment.skillName.toLowerCase()
                );
                const passed = latestResult?.passed;

                return (
                  <div
                    key={assessment.id}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate">{assessment.category}</span>
                          {latestResult && (
                            <span className="text-[10px] font-mono text-cyan-400 tabular-nums">
                              ({latestResult.score}%)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>10 Qs · 15m</span>
                          {latestResult?.skillLevel && (
                            <>
                              <span>·</span>
                              <span className="text-slate-300 font-mono">{latestResult.skillLevel}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {passed ? (
                        <button
                          onClick={() => handleStartAssessment(assessment.id)}
                          className="px-2 py-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 border border-emerald-800/60 rounded transition-colors whitespace-nowrap"
                        >
                          Passed ({latestResult.score}%)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartAssessment(assessment.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap"
                        >
                          Start Test
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Next Steps to Maximize Proof */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>How to Reach 100% Score</span>
            </h2>
            <p className="text-xs text-slate-400 mb-3">
              Recruiters prioritize candidates with end-to-end evidence chains.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded bg-slate-950/40 border border-slate-800/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-200 font-medium">Link projects to unverified skills:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Connect claimed skills to repos with verifiable git commits.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded bg-slate-950/40 border border-slate-800/80">
                <GitCommit className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-200 font-medium">Add Pull Request Artifacts:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Add direct PR review links showing code review discussions.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded bg-slate-950/40 border border-slate-800/80">
                <Award className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-200 font-medium">Share Passport with Recruiters:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Recruiter validations provide the highest trust multiplier.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
