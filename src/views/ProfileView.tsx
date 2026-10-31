import React, { useState } from 'react';
import {
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  GraduationCap,
  Briefcase,
  MapPin,
  Mail,
  Globe,
  Github,
  Linkedin,
  AlertCircle,
  X
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { SkillCategory, SkillLevel, SkillItem } from '../types';
import { VerificationBadge } from '../components/Common/VerificationBadge';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, addSkill, updateSkill, deleteSkill } = useProfile();

  // Profile Form State
  const [formData, setFormData] = useState({
    name: profile.name,
    headline: profile.headline,
    bio: profile.bio,
    university: profile.university,
    degree: profile.degree,
    graduationYear: profile.graduationYear,
    location: profile.location,
    email: profile.email,
    targetRole: profile.targetRole,
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl,
    portfolioUrl: profile.portfolioUrl
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add Skill Modal State
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [skillFormError, setSkillFormError] = useState('');

  // Handle Form Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.headline.trim()) newErrors.headline = 'Professional headline is required';
    if (!formData.university.trim()) newErrors.university = 'University / College is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    updateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      setSkillFormError('Skill name cannot be empty');
      return;
    }

    // Check duplicate
    if (profile.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setSkillFormError('This skill is already in your inventory');
      return;
    }

    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      verificationStatus: 'unverified',
      linkedProjectIds: []
    });

    setNewSkillName('');
    setSkillFormError('');
    setIsAddSkillOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <User className="h-6 w-6 text-cyan-400" />
            <span>Student Profile & Skill Inventory</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your credentials, education details, and technical skill catalog.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile changes saved to LocalStorage!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Details & Links Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-cyan-400" />
              <span>Personal & Professional Info</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                  }`}
                  placeholder="e.g. Alex Rivera"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                  }`}
                  placeholder="e.g. alex@university.edu"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Professional Headline <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 ${
                  errors.headline ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="e.g. Junior Systems & Full-Stack Engineer"
              />
              {errors.headline && <p className="text-xs text-red-400 mt-1">{errors.headline}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Technical Bio & Focus
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Describe your engineering focus, key achievements, and target roles..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  University / College <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className={`w-full rounded-lg border bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-1 ${
                    errors.university ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'
                  }`}
                  placeholder="e.g. University of Washington"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Degree & Major
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. B.S. in Computer Science"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. 2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. Seattle, WA, USA"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Role
                </label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. Junior Full-Stack Engineer"
                />
              </div>
            </div>

            {/* Verification Links */}
            <h2 className="text-base font-bold text-white pt-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Public Verification Links</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                  <Github className="h-3.5 w-3.5 text-slate-400" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="https://github.com/your-handle"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                  <Linkedin className="h-3.5 w-3.5 text-slate-400" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="https://linkedin.com/in/your-handle"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span>Personal Portfolio / Blog URL</span>
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="https://yourname.dev"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Skill Inventory List & Add Modal */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Skill Inventory</h2>
                <p className="text-xs text-slate-400">{profile.skills.length} skills listed</p>
              </div>
              <button
                onClick={() => setIsAddSkillOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {profile.skills.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No skills added yet. Click &quot;Add Skill&quot; to catalog your technical capabilities.
              </div>
            ) : (
              <div className="space-y-3">
                {profile.skills.map(skill => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/40 flex items-start justify-between gap-3 group hover:border-slate-700 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">{skill.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({skill.category})</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <span>Level: {skill.level}</span>
                        <span>·</span>
                        <VerificationBadge status={skill.verificationStatus} score={skill.assessmentScore} />
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors opacity-80 group-hover:opacity-100"
                      title="Delete skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0c1222] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Add Technical Skill</h2>
              <button
                onClick={() => setIsAddSkillOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="space-y-4 pt-4">
              {skillFormError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800 p-2.5 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{skillFormError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. PostgreSQL, Redis, Kubernetes, React"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Technical Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={e => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Self-Assessed Proficiency
                </label>
                <select
                  value={newSkillLevel}
                  onChange={e => setNewSkillLevel(e.target.value as SkillLevel)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Beginner">Beginner (Basic Syntax & Concepts)</option>
                  <option value="Intermediate">Intermediate (Independent Project Use)</option>
                  <option value="Advanced">Advanced (Production Experience & Optimization)</option>
                  <option value="Expert">Expert (Deep Internals, Architecture & Benchmarking)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSkillOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
