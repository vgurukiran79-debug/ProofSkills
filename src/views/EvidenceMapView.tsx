import React, { useState, useMemo } from 'react';
import {
  Network,
  CheckCircle2,
  FolderGit2,
  ExternalLink,
  Search,
  Github,
  Clock,
  History,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  Info
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { SkillItem, ProjectEvidence, AssessmentResult } from '../types';
import { SkillLevelBadge } from '../components/Common/SkillLevelBadge';

export const EvidenceMapView: React.FC = () => {
  const { profile, setActiveView, setActiveAssessmentId } = useProfile();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'assessed' | 'project' | 'self_reported'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(() => profile.skills[0] || null);

  // Helper to determine visual state for a skill
  const getSkillState = (skill: SkillItem): 'assessed' | 'project' | 'self_reported' => {
    const hasProjects = profile.projects.some(p => 
      (skill.linkedProjectIds || []).includes(p.id) ||
      (p.skillsDemonstrated || p.skillsProved || []).some(s => s.toLowerCase() === skill.name.toLowerCase())
    );

    if (hasProjects) return 'project'; // Cyan: Project evidence submitted

    const hasAssessment = profile.assessmentResults.some(r =>
      r.skillName.toLowerCase().includes(skill.name.toLowerCase()) ||
      skill.name.toLowerCase().includes(r.skillName.toLowerCase()) ||
      (r.category && skill.name.toLowerCase().includes(r.category.toLowerCase()))
    ) || (skill.assessmentScore !== undefined && skill.assessmentScore > 0);

    if (hasAssessment) return 'assessed'; // Blue: Assessed

    return 'self_reported'; // Grey: Self-reported only
  };

  // Filter skills
  const filteredSkills = useMemo(() => {
    return profile.skills.filter(s => {
      const state = getSkillState(s);
      const matchesFilter = statusFilter === 'all' || state === statusFilter;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [profile.skills, profile.projects, profile.assessmentResults, statusFilter, searchQuery]);

  // Associated projects for selected skill
  const selectedSkillProjects = useMemo((): ProjectEvidence[] => {
    if (!selectedSkill) return [];
    return profile.projects.filter(p =>
      (selectedSkill.linkedProjectIds || []).includes(p.id) ||
      (p.skillsDemonstrated || p.skillsProved || []).some(s => s.toLowerCase() === selectedSkill.name.toLowerCase())
    );
  }, [selectedSkill, profile.projects]);

  // Associated assessment history for selected skill
  const selectedSkillAssessments = useMemo((): AssessmentResult[] => {
    if (!selectedSkill) return [];
    return profile.assessmentResults.filter(r =>
      r.skillName.toLowerCase().includes(selectedSkill.name.toLowerCase()) ||
      selectedSkill.name.toLowerCase().includes(r.skillName.toLowerCase()) ||
      (r.category && selectedSkill.name.toLowerCase().includes(r.category.toLowerCase()))
    );
  }, [selectedSkill, profile.assessmentResults]);

  // Counts for filters
  const counts = useMemo(() => {
    let assessed = 0;
    let project = 0;
    let selfReported = 0;
    profile.skills.forEach(s => {
      const st = getSkillState(s);
      if (st === 'project') project++;
      else if (st === 'assessed') assessed++;
      else selfReported++;
    });
    return { assessed, project, selfReported, total: profile.skills.length };
  }, [profile.skills, profile.projects, profile.assessmentResults]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Visual Verification Matrix</span>
            <span>·</span>
            <span className="text-cyan-400 font-mono">Interactive Proof Graph</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Network className="h-6 w-6 text-cyan-400" />
            <span>Evidence Map</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect each skill directly to completed assessments, repositories, code commits, and project evidence.
          </p>
        </div>

        <button
          onClick={() => setActiveView('passport')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/80 rounded-lg transition-colors"
        >
          <span>View Skill Passport</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Visual State Legend & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* State 1: Cyan Project Evidence */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'project' ? 'all' : 'project')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'project'
              ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-500/50'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span>Project Evidence</span>
            </span>
            <span className="text-base font-bold font-mono text-cyan-300 tabular-nums">
              {counts.project}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Backed by live GitHub source code, commits, and functional applications.
          </p>
        </button>

        {/* State 2: Blue Assessed */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'assessed' ? 'all' : 'assessed')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'assessed'
              ? 'border-blue-400 bg-blue-950/40 ring-1 ring-blue-500/50'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>Assessed</span>
            </span>
            <span className="text-base font-bold font-mono text-blue-300 tabular-nums">
              {counts.assessed}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tested through standardized, timed technical assessments with scores.
          </p>
        </button>

        {/* State 3: Grey Self-Reported */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'self_reported' ? 'all' : 'self_reported')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'self_reported'
              ? 'border-slate-500 bg-slate-800/40 ring-1 ring-slate-500/50'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
              <span>Self-Reported Only</span>
            </span>
            <span className="text-base font-bold font-mono text-slate-300 tabular-nums">
              {counts.selfReported}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Candidate claimed skill without linked project or assessment proof.
          </p>
        </button>
      </div>

      {/* Search & Active Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills or domain..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
          <span>Showing: <strong className="text-white font-mono">{filteredSkills.length}</strong> of {profile.skills.length} skills</span>
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Graph & Deep Inspection View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Cols: Interactive Visual Evidence Graph */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-5 sm:p-6 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5 text-xs">
              <span className="font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Click any node to audit its full evidence chain
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Real-Time State Mapping
              </span>
            </div>

            {/* Visual Graph Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredSkills.map(skill => {
                const state = getSkillState(skill);
                const isSelected = selectedSkill?.id === skill.id;

                let borderClass = 'border-slate-800 bg-slate-950/40 hover:border-slate-700';
                let indicatorColor = 'bg-slate-500';
                let statusLabel = 'Self-Reported Only';
                let statusTextColor = 'text-slate-400';

                if (state === 'project') {
                  borderClass = isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-500/50'
                    : 'border-cyan-900/50 bg-cyan-950/15 hover:border-cyan-500/60';
                  indicatorColor = 'bg-cyan-400';
                  statusLabel = 'Project Evidence Submitted';
                  statusTextColor = 'text-cyan-400';
                } else if (state === 'assessed') {
                  borderClass = isSelected
                    ? 'border-blue-400 bg-blue-950/30 ring-1 ring-blue-500/50'
                    : 'border-blue-900/50 bg-blue-950/15 hover:border-blue-500/60';
                  indicatorColor = 'bg-blue-500';
                  statusLabel = 'Assessed';
                  statusTextColor = 'text-blue-400';
                } else {
                  if (isSelected) {
                    borderClass = 'border-slate-500 bg-slate-900/60 ring-1 ring-slate-500/50';
                  }
                }

                // Check assessment score
                const assessment = profile.assessmentResults.find(
                  r => r.skillName.toLowerCase() === skill.name.toLowerCase() ||
                       r.category.toLowerCase() === skill.name.toLowerCase()
                );
                const score = skill.assessmentScore || assessment?.score;

                // Check project count
                const projectCount = profile.projects.filter(p =>
                  (skill.linkedProjectIds || []).includes(p.id) ||
                  (p.skillsDemonstrated || p.skillsProved || []).some(s => s.toLowerCase() === skill.name.toLowerCase())
                ).length;

                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${borderClass}`}
                  >
                    {/* Visual state top accent */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${indicatorColor}`} />
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${statusTextColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">({skill.category})</span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">
                      {skill.name}
                    </h3>

                    {/* Evidence Badges Substrip */}
                    <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-400">
                        {score !== undefined ? (
                          <span className="font-mono text-cyan-300 font-semibold tabular-nums">
                            {score}% Score
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">No test taken</span>
                        )}
                      </div>

                      <div className="text-[11px] font-mono text-slate-400">
                        {projectCount > 0 ? (
                          <span className="text-cyan-400 font-semibold">{projectCount} Project{projectCount > 1 ? 's' : ''}</span>
                        ) : (
                          <span>0 Repos</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Deep Inspection Details Panel */}
        <div className="lg:col-span-5">
          {selectedSkill ? (
            <div className="rounded-2xl border border-slate-800 bg-[#090e1c] p-6 shadow-2xl space-y-6 sticky top-20">
              {/* Header */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-400 uppercase tracking-wider">
                    {selectedSkill.category} Domain
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${
                      getSkillState(selectedSkill) === 'project'
                        ? 'bg-cyan-400'
                        : getSkillState(selectedSkill) === 'assessed'
                        ? 'bg-blue-500'
                        : 'bg-slate-500'
                    }`} />
                    <span className="text-xs font-mono font-semibold text-white">
                      {getSkillState(selectedSkill) === 'project'
                        ? 'Project Evidence Submitted'
                        : getSkillState(selectedSkill) === 'assessed'
                        ? 'Assessment Completed'
                        : 'Self-Reported'}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-white">
                  {selectedSkill.name}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>Self-Assessed Level: <strong className="text-white">{selectedSkill.level}</strong></span>
                </div>
              </div>

              {/* Assessment Score Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Assessment Proof</span>
                  </span>
                  {selectedSkill.assessmentScore !== undefined && (
                    <span className="font-mono text-cyan-300 font-bold text-sm tabular-nums">
                      {selectedSkill.assessmentScore} / 100
                    </span>
                  )}
                </div>

                {selectedSkillAssessments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSkillAssessments.map(ass => (
                      <div key={ass.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{ass.category || ass.skillName}</span>
                          <span className="font-mono text-emerald-400 font-bold">{ass.score}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Tier: <SkillLevelBadge level={ass.skillLevel} /></span>
                          <span>Assessed: {ass.completedAt.split('T')[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs flex items-center justify-between">
                    <span className="text-slate-400">No standardized assessment completed.</span>
                    <button
                      onClick={() => setActiveView('assessments')}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Take Test →
                    </button>
                  </div>
                )}
              </div>

              {/* Associated Projects Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <FolderGit2 className="h-4 w-4" />
                    <span>Associated Project Evidence</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {selectedSkillProjects.length} Repos
                  </span>
                </div>

                {selectedSkillProjects.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSkillProjects.map(proj => (
                      <div key={proj.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{proj.evidenceType || proj.category}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-white"
                              title="Open GitHub Repository"
                            >
                              <Github className="h-3.5 w-3.5" />
                            </a>
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-cyan-400"
                                title="Open Live Demo"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {(proj.technologies || []).map((t, i) => (
                            <span key={i} className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs flex items-center justify-between">
                    <span className="text-slate-400">No project linked to this skill.</span>
                    <button
                      onClick={() => setActiveView('projects')}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Link Project →
                    </button>
                  </div>
                )}
              </div>

              {/* Honest Evidence Disclaimer (Mandatory) */}
              <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                <Info className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                <span>
                  Evidence reflects candidate-submitted project repositories, code commits, and locally proctored standardized assessments. No claim of unverified external ownership is made.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              Select a skill from the graph to inspect its evidence chain.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
