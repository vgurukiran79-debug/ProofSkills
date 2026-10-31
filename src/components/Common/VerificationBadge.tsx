import React from 'react';
import { CheckCircle2, FolderGit2, User, Layers } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus | string;
  score?: number;
  className?: string;
  showScore?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  score,
  className = '',
  showScore = true
}) => {
  // Normalize status to the 3 official tiers
  const isProjectEvidence = status === 'project_evidence' || status === 'project_backed' || status === 'recruiter_verified';
  const isAssessmentCompleted = status === 'assessment_completed' || status === 'assessment_passed';

  if (isProjectEvidence) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 ${className}`}
        title="Backed by verifiable project source code and pull requests"
      >
        <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
        <span>Project Evidence Submitted</span>
        {showScore && score !== undefined && (
          <span className="font-mono text-cyan-300 tabular-nums">({score}%)</span>
        )}
      </span>
    );
  }

  if (isAssessmentCompleted) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 ${className}`}
        title="Verified via standardized timed technical assessment"
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-400" />
        <span>Assessment Completed</span>
        {showScore && score !== undefined && (
          <span className="font-mono text-blue-300 tabular-nums">({score}%)</span>
        )}
      </span>
    );
  }

  // Default: Self-reported only
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 ${className}`}
      title="Self-reported claim without attached assessment or project evidence"
    >
      <User className="h-3.5 w-3.5 shrink-0 text-slate-500" />
      <span>Self-Reported</span>
    </span>
  );
};
