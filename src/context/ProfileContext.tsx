import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, SkillItem, ProjectEvidence, AssessmentResult, VerificationStatus } from '../types';
import { DEMO_PROFILE, BLANK_PROFILE } from '../data/mockData';

interface ProfileContextType {
  profile: StudentProfile;
  evidenceScore: number;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  addProject: (project: Omit<ProjectEvidence, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectEvidence>) => void;
  deleteProject: (id: string) => void;
  saveAssessmentResult: (result: AssessmentResult) => void;
  addRecruiterFeedback: (note: {
    recruiterName: string;
    company: string;
    rating: number;
    note: string;
    decision: 'shortlisted' | 'interview_scheduled' | 'reviewing';
  }) => void;
  resetToDemo: () => void;
  clearToBlank: () => void;
  importProfileJSON: (jsonString: string) => boolean;
  exportProfileJSON: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  activeAssessmentId: string | null;
  setActiveAssessmentId: (id: string | null) => void;
}

const STORAGE_KEY = 'proofskill_student_profile_v1';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function calculateEvidenceScore(profile: StudentProfile): number {
  if (!profile.skills.length && !profile.projects.length) return 0;

  let score = 0;

  // Assessments passed (max 30 pts across distinct categories)
  const uniquePassed = new Set(
    profile.assessmentResults.filter(r => r.passed).map(r => r.category || r.skillName)
  ).size;
  score += Math.min(30, uniquePassed * 5);

  // Skills with concrete project backing (max 30 pts)
  const skillsWithProjects = profile.skills.filter(s => s.linkedProjectIds && s.linkedProjectIds.length > 0).length;
  score += Math.min(30, skillsWithProjects * 5);

  // Projects with live artifacts, tests, and PRs (max 25 pts)
  profile.projects.forEach(p => {
    let projectPoints = 0;
    if (p.githubUrl) projectPoints += 2;
    if (p.liveUrl) projectPoints += 2;
    if (typeof p.testCoveragePercent === 'number' && p.testCoveragePercent >= 80) projectPoints += 2;
    if (p.artifacts && p.artifacts.length > 0) projectPoints += 3;
    score += Math.min(10, projectPoints);
  });

  // Comprehensive evidence backing (max 15 pts)
  const hasStrongEvidence = profile.projects.length >= 2 || 
    profile.skills.some(s => s.verificationStatus === 'project_evidence');
  if (hasStrongEvidence) {
    score += 15;
  }

  return Math.min(100, Math.round(score));
}

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEMO_PROFILE;
  });

  const [activeView, setActiveView] = useState<string>('landing');
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [profile]);

  const evidenceScore = calculateEvidenceScore(profile);

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const addSkill = (newSkill: Omit<SkillItem, 'id'>) => {
    const id = `skill-${Date.now()}`;
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill, id }]
    }));
  };

  const updateSkill = (id: string, updated: Partial<SkillItem>) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s => (s.id === id ? { ...s, ...updated } : s))
    }));
  };

  const deleteSkill = (id: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const addProject = (newProject: Omit<ProjectEvidence, 'id'>) => {
    const id = `proj-${Date.now()}`;
    const projectWithId: ProjectEvidence = {
      ...newProject,
      id,
      skillsDemonstrated: newProject.skillsDemonstrated || newProject.skillsProved || [],
      skillsProved: newProject.skillsDemonstrated || newProject.skillsProved || []
    };
    
    setProfile(prev => {
      // Automatically link skills tagged in this project
      const demonstratedSkills = projectWithId.skillsDemonstrated || [];
      const updatedSkills: SkillItem[] = prev.skills.map(s => {
        const isDemonstrated = demonstratedSkills.some(ds => ds.toLowerCase() === s.name.toLowerCase());
        if (isDemonstrated) {
          const currentLinks = s.linkedProjectIds || [];
          return {
            ...s,
            verificationStatus: 'project_evidence' as VerificationStatus,
            linkedProjectIds: Array.from(new Set([...currentLinks, id]))
          };
        }
        return s;
      });

      return {
        ...prev,
        projects: [projectWithId, ...prev.projects],
        skills: updatedSkills
      };
    });
  };

  const updateProject = (id: string, updated: Partial<ProjectEvidence>) => {
    setProfile(prev => {
      const updatedProjects = prev.projects.map(p => (p.id === id ? { ...p, ...updated } : p));
      const demonstrated = updated.skillsDemonstrated || updated.skillsProved || [];

      const updatedSkills: SkillItem[] = prev.skills.map(s => {
        const isDemonstrated = demonstrated.some(ds => ds.toLowerCase() === s.name.toLowerCase());
        if (isDemonstrated) {
          const currentLinks = s.linkedProjectIds || [];
          return {
            ...s,
            verificationStatus: 'project_evidence' as VerificationStatus,
            linkedProjectIds: Array.from(new Set([...currentLinks, id]))
          };
        }
        return s;
      });

      return {
        ...prev,
        projects: updatedProjects,
        skills: updatedSkills
      };
    });
  };

  const deleteProject = (id: string) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      skills: prev.skills.map(s => ({
        ...s,
        linkedProjectIds: (s.linkedProjectIds || []).filter(pid => pid !== id)
      }))
    }));
  };

  const saveAssessmentResult = (result: AssessmentResult) => {
    setProfile(prev => {
      // Prepend to history so newest attempt is at the top
      const resultWithId: AssessmentResult = {
        ...result,
        id: result.id || `res-${Date.now()}`
      };
      const newResults = [resultWithId, ...prev.assessmentResults];

      // Update matching skill in skills list (or add it if not present)
      let skillMatched = false;
      const updatedSkills: SkillItem[] = prev.skills.map(skill => {
        const matches = 
          skill.name.toLowerCase() === result.skillName.toLowerCase() ||
          skill.name.toLowerCase() === (result.category || '').toLowerCase() ||
          result.skillName.toLowerCase().includes(skill.name.toLowerCase()) ||
          skill.name.toLowerCase().includes(result.skillName.toLowerCase());

        if (matches) {
          skillMatched = true;
          const newStatus: VerificationStatus = result.passed 
            ? (skill.verificationStatus === 'recruiter_verified' ? 'recruiter_verified' : 'assessment_passed')
            : skill.verificationStatus;

          return {
            ...skill,
            verificationStatus: newStatus,
            assessmentScore: Math.max(skill.assessmentScore || 0, result.score),
            assessmentDate: result.completedAt.split('T')[0],
            assessmentSkillLevel: result.skillLevel
          };
        }
        return skill;
      });

      // If skill was not in inventory and was passed, add it automatically
      let finalSkills = updatedSkills;
      if (!skillMatched && result.passed) {
        finalSkills = [
          ...updatedSkills,
          {
            id: `skill-${Date.now()}`,
            name: result.skillName,
            category: (result.category === 'Web Development' ? 'Frontend' : result.category === 'Artificial Intelligence and Machine Learning' ? 'AI / ML' : 'Backend') as any,
            level: result.skillLevel === 'Advanced' ? 'Advanced' : result.skillLevel === 'Proficient' ? 'Intermediate' : 'Beginner',
            verificationStatus: 'assessment_passed',
            assessmentScore: result.score,
            assessmentDate: result.completedAt.split('T')[0],
            assessmentSkillLevel: result.skillLevel,
            linkedProjectIds: []
          }
        ];
      }

      return {
        ...prev,
        assessmentResults: newResults,
        skills: finalSkills
      };
    });
  };

  const addRecruiterFeedback = (note: {
    recruiterName: string;
    company: string;
    rating: number;
    note: string;
    decision: 'shortlisted' | 'interview_scheduled' | 'reviewing';
  }) => {
    setProfile(prev => ({
      ...prev,
      recruiterNotes: [
        {
          ...note,
          evaluatedAt: new Date().toISOString()
        },
        ...(prev.recruiterNotes || [])
      ]
    }));
  };

  const resetToDemo = () => {
    setProfile(DEMO_PROFILE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PROFILE));
  };

  const clearToBlank = () => {
    setProfile(BLANK_PROFILE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(BLANK_PROFILE));
  };

  const exportProfileJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `proofskill_${profile.passportId || 'passport'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importProfileJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.name && Array.isArray(parsed.skills)) {
        setProfile(parsed);
        return true;
      }
    } catch {
      // invalid
    }
    return false;
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        evidenceScore,
        updateProfile,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        saveAssessmentResult,
        addRecruiterFeedback,
        resetToDemo,
        clearToBlank,
        importProfileJSON,
        exportProfileJSON,
        activeView,
        setActiveView,
        activeAssessmentId,
        setActiveAssessmentId
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
