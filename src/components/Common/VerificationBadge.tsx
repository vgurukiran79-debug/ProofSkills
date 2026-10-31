import React from 'react';
import { CheckCheck, CheckCircle2, FolderGit2, Clock } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
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
  switch (status) {
    case 'recruiter_verified':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 ${className}`}>
          <CheckCheck className="h-3.5 w-3.5 shrink-0" />
          <span>Recruiter Verified</span>
          {showScore && score !== undefined && (
            <span className="font-mono text-emerald-300 tabular-nums">({score}%)</span>
          )}
        </span>
      );

    case 'assessment_passed':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 ${className}`}>
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>Assessment Passed</span>
          {showScore && score !== undefined && (
            <span className="font-mono text-cyan-300 tabular-nums">({score}%)</span>
          )}
        </span>
      );

    case 'project_backed':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 ${className}`}>
          <FolderGit2 className="h-3.5 w-3.5 shrink-0" />
          <span>Project Backed</span>
        </span>
      );

    case 'unverified':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs text-slate-400 ${className}`}>
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Pending Evidence</span>
        </span>
      );
  }
};
