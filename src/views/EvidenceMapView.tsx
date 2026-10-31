import React, { useState } from 'react';
import {
  Network,
  CheckCircle2,
  FolderGit2,
  Award,
  ArrowRight,
  GitPullRequest,
  Search,
  Filter,
  ShieldCheck,
  CheckCheck,
  FileCheck2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { SkillCategory, SkillItem } from '../types';

export const EvidenceMapView: React.FC = () => {
  const { profile, setActiveView, setActiveAssessmentId } = useProfile();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // Filter skills
  const filteredSkills = profile.skills.filter(s => {
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const categories: string[] = ['all', 'Frontend', 'Backend', 'Database', 'DevOps', 'Algorithms', 'System Design', 'AI / ML'];

  const getVerificationTier = (skill: SkillItem) => {
    if (skill.verificationStatus === 'recruiter_verified') return { level: 4, name: 'Tier 4: Recruiter Audited', color: 'text-emerald-400' };
    if (skill.verificationStatus === 'project_backed') return { level: 3, name: 'Tier 3: Project Backed', color: 'text-blue-400' };
    if (skill.verificationStatus === 'assessment_passed') return { level: 2, name: 'Tier 2: Assessment Certified', color: 'text-cyan-400' };
    return { level: 1, name: 'Tier 1: Self-Claimed', color: 'text-slate-400' };
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-6 w-6 text-cyan-400" />
            <span>Interactive Evidence Map</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual proof lineage connecting every claimed skill directly to assessments, code commits, and PR artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('passport')}
            className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/80 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>View Skill Passport</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Proof Hierarchy Explanation Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/30">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Level 1</div>
          <div className="text-xs font-semibold text-slate-300 mt-0.5">Self-Claimed</div>
          <p className="text-[11px] text-slate-400 mt-1">Skill listed on resume or profile.</p>
        </div>

        <div className="p-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Level 2</div>
          <div className="text-xs font-semibold text-cyan-300 mt-0.5">Assessment Certified</div>
          <p className="text-[11px] text-slate-400 mt-1">Timed standardized exam passed.</p>
        </div>

        <div className="p-3 rounded-lg border border-blue-900/40 bg-blue-950/20">
          <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">Level 3</div>
          <div className="text-xs font-semibold text-blue-300 mt-0.5">Project Backed</div>
          <p className="text-[11px] text-slate-400 mt-1">Live repos, commits, and PRs.</p>
        </div>

        <div className="p-3 rounded-lg border border-emerald-900/40 bg-emerald-950/20">
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Level 4</div>
          <div className="text-xs font-semibold text-emerald-300 mt-0.5">Recruiter Audited</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified by hiring manager review.</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search skill or domain..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Interactive Segmented Filter Controls (Styled as functional tabs per guidelines) */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Evidence Matrix */}
      {filteredSkills.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
          No skills match your search or filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSkills.map(skill => {
            const tier = getVerificationTier(skill);
            const linkedProjects = profile.projects.filter(p => 
              (skill.linkedProjectIds || []).includes(p.id) || p.skillsProved.includes(skill.name)
            );
            const assessment = profile.assessmentResults.find(r => 
              r.skillName.toLowerCase().includes(skill.name.toLowerCase()) || 
              skill.name.toLowerCase().includes(r.skillName.toLowerCase())
            );

            return (
              <div
                key={skill.id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
                  {/* Left: Skill Identity */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-bold text-white">{skill.name}</h2>
                      <span className="text-xs font-mono text-slate-500">({skill.category})</span>
                      <span className={`text-xs font-semibold ${tier.color}`}>
                        {tier.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>Proficiency: <strong className="text-slate-200">{skill.level}</strong></span>
                      {skill.assessmentDate && (
                        <>
                          <span>·</span>
                          <span>Assessed: {skill.assessmentDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedSkill(skill)}
                      className="px-3 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-500/30 bg-cyan-950/30 rounded-lg hover:bg-cyan-950/60 transition-colors"
                    >
                      Audit Proof Chain
                    </button>
                  </div>
                </div>

                {/* Evidence Chain Visual Nodes */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Node 1: Theoretical & Code Assessment */}
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/50">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <FileCheck2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Assessment Proof</span>
                      </span>
                      {skill.assessmentScore !== undefined && (
                        <span className="font-mono text-cyan-400 font-bold tabular-nums">
                          {skill.assessmentScore}%
                        </span>
                      )}
                    </div>

                    {assessment ? (
                      <p className="text-slate-300 text-[11px]">
                        Passed timed exam with {assessment.score}% score on {assessment.completedAt.split('T')[0]}.
                      </p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">No standardized test taken.</span>
                        <button
                          onClick={() => setActiveView('assessments')}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          Take Test →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Node 2: Project Repositories */}
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/50">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <FolderGit2 className="h-3.5 w-3.5 text-blue-400" />
                        <span>Repository Proof</span>
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {linkedProjects.length} repos
                      </span>
                    </div>

                    {linkedProjects.length > 0 ? (
                      <div className="space-y-1">
                        {linkedProjects.slice(0, 2).map(p => (
                          <div key={p.id} className="text-[11px] text-slate-300 truncate flex items-center gap-1">
                            <span className="text-blue-400">·</span>
                            <span className="truncate">{p.title}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">No project linked yet.</span>
                        <button
                          onClick={() => setActiveView('projects')}
                          className="text-[11px] text-blue-400 hover:underline"
                        >
                          Link Project →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Node 3: Artifacts & PR Inspections */}
                  <div className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/50">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <GitPullRequest className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Artifacts & Commits</span>
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {linkedProjects.reduce((acc, p) => acc + (p.artifacts?.length || 0), 0)} items
                      </span>
                    </div>

                    {linkedProjects.some(p => p.artifacts && p.artifacts.length > 0) ? (
                      <p className="text-emerald-300 text-[11px] truncate">
                        Linked PRs, test reports & architecture RFCs available.
                      </p>
                    ) : (
                      <span className="text-slate-500 text-[11px]">
                        Attach PR diffs or test logs to reach Tier 4.
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proof Chain Audit Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0c1222] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{selectedSkill.category}</span>
                <h2 className="text-xl font-bold text-white mt-1">Proof Audit: {selectedSkill.name}</h2>
              </div>
              <button onClick={() => setSelectedSkill(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-slate-400 block mb-1">Verification Status</span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span>{selectedSkill.verificationStatus.replace('_', ' ').toUpperCase()}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-300 mb-2">Linked Evidence Projects:</h3>
                {profile.projects.filter(p => (selectedSkill.linkedProjectIds || []).includes(p.id) || p.skillsProved.includes(selectedSkill.name)).length > 0 ? (
                  <div className="space-y-2">
                    {profile.projects
                      .filter(p => (selectedSkill.linkedProjectIds || []).includes(p.id) || p.skillsProved.includes(selectedSkill.name))
                      .map(p => (
                        <div key={p.id} className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{p.title}</span>
                            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                              <span>Repo</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{p.tagline}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No projects linked to this skill yet.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSkill(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
