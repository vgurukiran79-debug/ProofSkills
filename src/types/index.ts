export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type VerificationStatus = 'self_reported' | 'assessment_completed' | 'project_evidence' | 'unverified' | 'assessment_passed' | 'project_backed' | 'recruiter_verified';
export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Algorithms' | 'System Design' | 'AI / ML';

export type AssessmentCategory =
  | 'Python'
  | 'Java'
  | 'C Programming'
  | 'Data Structures and Algorithms'
  | 'Web Development'
  | 'Artificial Intelligence and Machine Learning';

export type AssessmentSkillLevel = 'Beginner' | 'Developing' | 'Proficient' | 'Advanced';

export function getSkillLevelFromScore(score: number): AssessmentSkillLevel {
  if (score >= 85) return 'Advanced';
  if (score >= 70) return 'Proficient';
  if (score >= 40) return 'Developing';
  return 'Beginner';
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  verificationStatus: VerificationStatus;
  assessmentScore?: number;
  assessmentDate?: string;
  assessmentSkillLevel?: AssessmentSkillLevel;
  linkedProjectIds: string[];
}

export interface ProjectEvidenceArtifact {
  id: string;
  type: 'github_pr' | 'commit_log' | 'live_demo' | 'architecture_spec' | 'test_report';
  title: string;
  url: string;
  description: string;
}

export interface ProjectEvidence {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  evidenceType: 'Full-Stack Application' | 'Backend & System Architecture' | 'Open Source Contribution' | 'Algorithms & Data Pipeline' | 'Independent Prototype' | string;
  technologies: string[];
  skillsDemonstrated: string[]; // skills demonstrated by this project
  skillsProved: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string; // project image or screenshot
  architectureNotes?: string;
  challengesSolved?: string;
  testCoveragePercent?: number;
  commitsCount?: number;
  completedDate: string;
  artifacts?: ProjectEvidenceArtifact[];
  verifiedByRecruiter?: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[]; // Exactly 4 options
  correctOptionIndex: number; // 0, 1, 2, or 3
  explanation: string;
  category: string;
}

export interface AssessmentTest {
  id: string;
  title: string;
  skillName: string;
  category: AssessmentCategory;
  durationMinutes: number; // 15 minutes
  passingScore: number; // 70
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  iconName?: string;
  topicsCovered: string[];
  questions: AssessmentQuestion[]; // 10 questions
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  category: AssessmentCategory | string;
  skillName: string;
  score: number; // 0 - 100 (10 points per question)
  totalQuestions: number; // 10
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  skillLevel: AssessmentSkillLevel;
  timeTakenSeconds: number;
  passed: boolean;
  completedAt: string;
  userAnswers: Record<string, number>;
}

export interface StudentProfile {
  id: string;
  passportId: string;
  name: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  university: string;
  college?: string; // college alias
  degree: string;
  course?: string; // course alias
  graduationYear: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  targetRole: string;
  skills: SkillItem[];
  projects: ProjectEvidence[];
  assessmentResults: AssessmentResult[];
  verificationHash: string;
  passportGeneratedDate?: string;
  isPublic: boolean;
  recruiterNotes?: {
    recruiterName: string;
    company: string;
    rating: number; // 1-5
    note: string;
    decision: 'shortlisted' | 'interview_scheduled' | 'reviewing';
    evaluatedAt: string;
  }[];
}
