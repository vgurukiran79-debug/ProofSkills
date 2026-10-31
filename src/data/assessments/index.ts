import { AssessmentTest } from '../../types';

import pythonData from './python.json';
import javaData from './java.json';
import cProgData from './c_programming.json';
import dsaData from './dsa.json';
import webDevData from './web_development.json';
import aiMlData from './ai_ml.json';

export const ALL_ASSESSMENTS: AssessmentTest[] = [
  pythonData as unknown as AssessmentTest,
  javaData as unknown as AssessmentTest,
  cProgData as unknown as AssessmentTest,
  dsaData as unknown as AssessmentTest,
  webDevData as unknown as AssessmentTest,
  aiMlData as unknown as AssessmentTest
];

export const getAssessmentById = (id: string): AssessmentTest | undefined => {
  return ALL_ASSESSMENTS.find(a => a.id === id);
};

export const getAssessmentByCategory = (category: string): AssessmentTest | undefined => {
  return ALL_ASSESSMENTS.find(a => a.category.toLowerCase() === category.toLowerCase());
};
