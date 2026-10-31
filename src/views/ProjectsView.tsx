import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  GitPullRequest,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Image as ImageIcon,
  Tag,
  Code2,
  Check
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { ProjectEvidence, ProjectEvidenceArtifact } from '../types';

export const ProjectsView: React.FC = () => {
  const { profile, addProject, updateProject, deleteProject } = useProfile();

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [selectedInspectionProject, setSelectedInspectionProject] = useState<ProjectEvidence | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceType, setEvidenceType] = useState('Full-Stack Application');
  const [category, setCategory] = useState('Web & Distributed Systems');
  const [technologiesInput, setTechnologiesInput] = useState('');
  const [skillsDemonstratedInput, setSkillsDemonstratedInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [commitsCount, setCommitsCount] = useState<number>(45);
  const [testCoverage, setTestCoverage] = useState<number>(85);
  const [architectureNotes, setArchitectureNotes] = useState('');

  // Form Validation & Success State
  const [formError, setFormError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Evidence Types List
  const evidenceTypes = [
    'Full-Stack Application',
    'Backend & System Architecture',
    'Open Source Contribution',
    'Algorithms & Data Pipeline',
    'Independent Prototype',
    'Mobile Application'
  ];

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProjectId(null);
    setTitle('');
    setTagline('');
    setDescription('');
    setEvidenceType('Full-Stack Application');
    setCategory('Web & Distributed Systems');
    setTechnologiesInput('');
    setSkillsDemonstratedInput('');
    setGithubUrl('');
    setLiveUrl('');
    setImageUrl('');
    setCommitsCount(35);
    setTestCoverage(80);
    setArchitectureNotes('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal with prefilled values
  const handleOpenEdit = (project: ProjectEvidence) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setTagline(project.tagline || '');
    setDescription(project.description);
    setEvidenceType(project.evidenceType || 'Full-Stack Application');
    setCategory(project.category);
    setTechnologiesInput((project.technologies || []).join(', '));
    setSkillsDemonstratedInput((project.skillsDemonstrated || project.skillsProved || []).join(', '));
    setGithubUrl(project.githubUrl);
    setLiveUrl(project.liveUrl || '');
    setImageUrl(project.imageUrl || '');
    setCommitsCount(project.commitsCount || 20);
    setTestCoverage(project.testCoveragePercent || 80);
    setArchitectureNotes(project.architectureNotes || '');
    setFormError(null);
    setIsFormOpen(true);
  };

  // URL Validation helper
  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Submit Handler (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Project title is required.');
      return;
    }

    if (!description.trim()) {
      setFormError('Project description is required.');
      return;
    }

    if (!githubUrl.trim() || !isValidUrl(githubUrl.trim())) {
      setFormError('Please enter a valid GitHub repository URL (must start with https://).');
      return;
    }

    if (liveUrl.trim() && !isValidUrl(liveUrl.trim())) {
      setFormError('Please enter a valid live demo URL or leave it blank.');
      return;
    }

    const techArray = technologiesInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const skillsArray = skillsDemonstratedInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      setFormError('Please specify at least one skill demonstrated by this project.');
      return;
    }

    const projectData = {
      title: title.trim(),
      tagline: tagline.trim() || title.trim(),
      description: description.trim(),
      evidenceType: evidenceType.trim(),
      category: category.trim(),
      technologies: techArray.length > 0 ? techArray : ['TypeScript', 'React'],
      skillsDemonstrated: skillsArray,
      skillsProved: skillsArray,
      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      architectureNotes: architectureNotes.trim() || 'Modular application architecture with component decoupling.',
      challengesSolved: 'Engineered maintainable architecture, resolved edge cases, and implemented automated tests.',
      testCoveragePercent: Number(testCoverage) || 80,
      commitsCount: Number(commitsCount) || 20,
      completedDate: new Date().toISOString().split('T')[0]
    };

    if (editingProjectId) {
      updateProject(editingProjectId, projectData);
      setActionNotice(`Project "${title}" updated successfully.`);
    } else {
      addProject(projectData);
      setActionNotice(`Project "${title}" added to evidence ledger.`);
    }

    setIsFormOpen(false);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleDelete = (id: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}" from your evidence ledger?`)) {
      deleteProject(id);
      setActionNotice(`Project "${projectTitle}" was removed.`);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Project Evidence Ledger</span>
            <span>·</span>
            <span className="text-cyan-400 font-mono">Source Code & Production Proof</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderGit2 className="h-6 w-6 text-cyan-400" />
            <span>My Projects & Evidence</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit repositories, live demos, and screenshots. Claims are mapped directly to your Evidence Map.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project Evidence</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl border border-cyan-800/80 bg-cyan-950/40 text-cyan-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {profile.projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/20 p-12 text-center max-w-xl mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-white">No Project Evidence Submitted Yet</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Claims without code are just claims. Submit your GitHub repositories, list technologies used, and show proof of what you have built.
          </p>
          <button
            onClick={handleOpenAdd}
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
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden"
            >
              <div>
                {/* Project Screenshot / Visual Banner */}
                {project.imageUrl ? (
                  <div className="h-36 w-full rounded-xl overflow-hidden mb-4 border border-slate-800 bg-slate-950">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-28 w-full rounded-xl mb-4 border border-slate-800/80 bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col items-center justify-center text-slate-600 group-hover:text-cyan-400 transition-colors">
                    <Code2 className="h-8 w-8 mb-1" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      {project.evidenceType || 'Source Code Evidence'}
                    </span>
                  </div>
                )}

                {/* Evidence Type & Category */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono font-semibold text-cyan-400 text-[11px]">
                    {project.evidenceType || 'Full-Stack Application'}
                  </span>
                  <span className="text-[11px] text-slate-500">{project.completedDate}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies Used */}
                <div className="mt-3.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">
                    Technologies Used:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(project.technologies || ['TypeScript', 'React']).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Demonstrated */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-500 block mb-1">
                    Skills Demonstrated:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(project.skillsDemonstrated || project.skillsProved || []).map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Links */}
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
                    onClick={() => handleOpenEdit(project)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                    title="Edit Project Evidence"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedInspectionProject(project)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Project Modal */}
      {selectedInspectionProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0c1222] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {selectedInspectionProject.evidenceType || 'Project Evidence'}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedInspectionProject.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Completed on {selectedInspectionProject.completedDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedInspectionProject(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedInspectionProject.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={selectedInspectionProject.imageUrl}
                  alt={selectedInspectionProject.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={selectedInspectionProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white"
              >
                <Github className="h-3.5 w-3.5 text-cyan-400" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </a>

              {selectedInspectionProject.liveUrl && (
                <a
                  href={selectedInspectionProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/80 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/80"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live Production Instance</span>
                </a>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {selectedInspectionProject.description}
              </p>
            </div>

            {/* Tech & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-2">
                  Technologies Used:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedInspectionProject.technologies || []).map((t, i) => (
                    <span key={i} className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-2">
                  Skills Demonstrated:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedInspectionProject.skillsDemonstrated || selectedInspectionProject.skillsProved || []).map((s, i) => (
                    <span key={i} className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedInspectionProject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-[#0c1222] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-cyan-400" />
                <span>{editingProjectId ? 'Edit Project Evidence' : 'Submit New Project Evidence'}</span>
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              {formError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800 p-3 rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Project Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Task Queue"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Evidence Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={evidenceType}
                    onChange={e => setEvidenceType(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {evidenceTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Project Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain what the project does, key features, architecture, and what technical problem it solves..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Technologies Used (comma separated) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={technologiesInput}
                    onChange={e => setTechnologiesInput(e.target.value)}
                    placeholder="e.g. Python, FastAPI, Docker, Redis"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Skills Demonstrated (comma separated) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={skillsDemonstratedInput}
                    onChange={e => setSkillsDemonstratedInput(e.target.value)}
                    placeholder="e.g. Python, Web Development, Backend"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    GitHub Repository URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Project Image or Screenshot URL (optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/screenshot.png"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                >
                  {editingProjectId ? 'Update Project' : 'Save Project Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
