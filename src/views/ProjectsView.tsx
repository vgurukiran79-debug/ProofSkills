import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  GitPullRequest,
  FileCode,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Tag,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { ProjectEvidence, ProjectEvidenceArtifact } from '../types';

export const ProjectsView: React.FC = () => {
  const { profile, addProject, deleteProject } = useProfile();

  // Add Project Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectEvidence | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Full-Stack Web');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [architectureNotes, setArchitectureNotes] = useState('');
  const [challengesSolved, setChallengesSolved] = useState('');
  const [testCoverage, setTestCoverage] = useState(85);
  const [commitsCount, setCommitsCount] = useState(50);
  const [skillsProvedInput, setSkillsProvedInput] = useState('');
  const [artifactTitle, setArtifactTitle] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [artifactType, setArtifactType] = useState<ProjectEvidenceArtifact['type']>('github_pr');
  const [artifactDesc, setArtifactDesc] = useState('');
  const [artifacts, setArtifacts] = useState<ProjectEvidenceArtifact[]>([]);
  const [formError, setFormError] = useState('');

  const handleAddArtifact = () => {
    if (!artifactTitle.trim() || !artifactUrl.trim()) return;
    const newArt: ProjectEvidenceArtifact = {
      id: `art-${Date.now()}`,
      type: artifactType,
      title: artifactTitle.trim(),
      url: artifactUrl.trim(),
      description: artifactDesc.trim() || 'Verified project artifact'
    };
    setArtifacts(prev => [...prev, newArt]);
    setArtifactTitle('');
    setArtifactUrl('');
    setArtifactDesc('');
  };

  const handleRemoveArtifact = (id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Project title is required');
      return;
    }
    if (!githubUrl.trim() || !githubUrl.startsWith('http')) {
      setFormError('A valid GitHub repository URL is required for evidence verification');
      return;
    }

    const skillsArray = skillsProvedInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addProject({
      title: title.trim(),
      tagline: tagline.trim() || 'Production project evidence',
      description: description.trim(),
      category: category.trim(),
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim() || undefined,
      skillsProved: skillsArray.length > 0 ? skillsArray : ['Full-Stack Engineering'],
      architectureNotes: architectureNotes.trim() || 'Standard modular architecture.',
      challengesSolved: challengesSolved.trim() || 'Addressed state synchronization and data integrity.',
      testCoveragePercent: Number(testCoverage) || 80,
      commitsCount: Number(commitsCount) || 20,
      completedDate: new Date().toISOString().split('T')[0],
      artifacts,
      verifiedByRecruiter: false
    });

    // Reset
    setTitle('');
    setTagline('');
    setDescription('');
    setGithubUrl('');
    setLiveUrl('');
    setArchitectureNotes('');
    setChallengesSolved('');
    setSkillsProvedInput('');
    setArtifacts([]);
    setFormError('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-cyan-400" />
            <span>Project Evidence Ledger</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Prove your hands-on engineering capabilities with verifiable repositories, pull requests, and architecture specs.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Submit Project Evidence</span>
        </button>
      </div>

      {/* Projects List or Empty State */}
      {profile.projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center max-w-xl mx-auto">
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-white">No Project Evidence Submitted Yet</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Claims without code are just claims. Submit a GitHub repository, describe the system architecture, and link PRs to prove your technical depth.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="mt-6 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Submit First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.projects.map(project => (
            <div
              key={project.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-medium text-cyan-400">{project.category}</span>
                  {project.verifiedByRecruiter && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Recruiter Verified</span>
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>

                {/* Evidence Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Commits</span>
                    <span className="text-slate-200 tabular-nums">{project.commitsCount} checked</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Test Suite</span>
                    <span className="text-cyan-400 tabular-nums">{project.testCoveragePercent}% coverage</span>
                  </div>
                </div>

                {/* Proved Skills */}
                <div className="mt-4">
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">Verified Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillsProved.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Open Live Deployment"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Inspect Evidence ({project.artifacts?.length || 0}) →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Evidence Inspection Drawer / Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0c1222] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-cyan-400">{selectedProject.category}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedProject.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedProject.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:text-white"
              >
                <Github className="h-3.5 w-3.5 text-cyan-400" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/80 text-xs text-cyan-300 hover:bg-cyan-950/80"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live Production Instance</span>
                </a>
              )}
            </div>

            {/* Architecture Details */}
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  <span>Architecture & Technical Decisions</span>
                </h3>
                <p className="text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedProject.architectureNotes}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Key Engineering Challenges Solved</span>
                </h3>
                <p className="text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedProject.challengesSolved}
                </p>
              </div>
            </div>

            {/* Evidence Artifacts */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>Verified Artifacts & Inspection Links</span>
              </h3>

              {selectedProject.artifacts && selectedProject.artifacts.length > 0 ? (
                <div className="space-y-2">
                  {selectedProject.artifacts.map(art => (
                    <div
                      key={art.id}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-950/40 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <GitPullRequest className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span className="text-xs font-semibold text-white">{art.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{art.description}</p>
                      </div>
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-[11px] font-medium text-cyan-300 hover:text-white bg-slate-900 border border-slate-700 rounded flex items-center gap-1 shrink-0"
                      >
                        <span>Open Proof</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No external artifacts linked yet.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Evidence Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0c1222] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-cyan-400" />
                <span>Submit Real Project Evidence</span>
              </h2>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
              {formError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800 p-2.5 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Task Queue"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Technical Domain
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Distributed Systems, Frontend, Security"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tagline / Key Metric
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. High-concurrency message broker benchmarked at 15k req/sec"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    GitHub Repo URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/project"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Live Demo / Staging URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    placeholder="https://app.yourdomain.com"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Test Coverage %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={testCoverage}
                    onChange={e => setTestCoverage(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Commit Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={commitsCount}
                    onChange={e => setCommitsCount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Skills Proved (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsProvedInput}
                    onChange={e => setSkillsProvedInput(e.target.value)}
                    placeholder="e.g. React, TypeScript, Go"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Architecture Notes & Key Decisions
                </label>
                <textarea
                  rows={2}
                  value={architectureNotes}
                  onChange={e => setArchitectureNotes(e.target.value)}
                  placeholder="Explain your architectural choices, data flow, caching or concurrency..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Challenges Solved
                </label>
                <textarea
                  rows={2}
                  value={challengesSolved}
                  onChange={e => setChallengesSolved(e.target.value)}
                  placeholder="What was the hardest bug, bottleneck, or design trade-off you tackled?"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Add Artifact Subsection */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Attach Verifiable Artifacts (PRs, Specs, Test Logs)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={artifactTitle}
                    onChange={e => setArtifactTitle(e.target.value)}
                    placeholder="Artifact Title (e.g. PR #42)"
                    className="text-xs rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-white"
                  />
                  <input
                    type="url"
                    value={artifactUrl}
                    onChange={e => setArtifactUrl(e.target.value)}
                    placeholder="URL (e.g. github.com/pull/42)"
                    className="text-xs rounded border border-slate-800 bg-slate-950 px-3 py-1.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddArtifact}
                    className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                  >
                    + Attach Artifact
                  </button>
                </div>

                {artifacts.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {artifacts.map(art => (
                      <div key={art.id} className="text-xs flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                        <span className="text-slate-300 truncate">{art.title} ({art.url})</span>
                        <button type="button" onClick={() => handleRemoveArtifact(art.id)} className="text-red-400">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  Save Project Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
