import React from 'react';
import { AssessmentSkillLevel } from '../../types';

interface SkillLevelBadgeProps {
  level: AssessmentSkillLevel;
  className?: string;
  showDot?: boolean;
}

export const SkillLevelBadge: React.FC<SkillLevelBadgeProps> = ({
  level,
  className = '',
  showDot = false
}) => {
  switch (level) {
    case 'Advanced':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 font-mono ${className}`}
        >
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          <span>Advanced</span>
        </span>
      );
    case 'Proficient':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 font-mono ${className}`}
        >
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
          <span>Proficient</span>
        </span>
      );
    case 'Developing':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 font-mono ${className}`}
        >
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
          <span>Developing</span>
        </span>
      );
    case 'Beginner':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 font-mono ${className}`}
        >
          {showDot && <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />}
          <span>Beginner</span>
        </span>
      );
  }
};
