import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck2,
  Clock,
  Play,
  RotateCcw,
  Check,
  X,
  Award,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Code,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  History,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { ALL_ASSESSMENTS, getAssessmentById } from '../data/assessments';
import { AssessmentTest, AssessmentResult, AssessmentSkillLevel, getSkillLevelFromScore } from '../types';
import { SkillLevelBadge } from '../components/Common/SkillLevelBadge';

export const AssessmentView: React.FC = () => {
  const { profile, saveAssessmentResult, activeAssessmentId, setActiveAssessmentId, setActiveView } = useProfile();

  // Active Test State
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins = 900s
  const [startTime, setStartTime] = useState<number>(0);
  
  // Submit Confirmation & Results
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);
  const [reviewMode, setReviewMode] = useState(true);

  // Auto-launch if activeAssessmentId was passed
  useEffect(() => {
    if (activeAssessmentId) {
      const found = ALL_ASSESSMENTS.find(a => a.id === activeAssessmentId || a.category.toLowerCase() === activeAssessmentId.toLowerCase());
      if (found) {
        startAssessment(found);
      }
      setActiveAssessmentId(null);
    }
  }, [activeAssessmentId]);

  // 15-Minute Countdown Timer
  useEffect(() => {
    if (!selectedAssessment || activeResult) return;

    if (timeLeftSeconds <= 0) {
      // Auto-submit immediately when timer reaches 0
      finalizeAndSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedAssessment, activeResult, timeLeftSeconds]);

  const startAssessment = (assessment: AssessmentTest) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds(assessment.durationMinutes * 60);
    setStartTime(Date.now());
    setActiveResult(null);
    setShowSubmitConfirmModal(false);
    setShowExitConfirmModal(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (activeResult) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Check unanswered questions count
  const unansweredCount = useMemo(() => {
    if (!selectedAssessment) return 0;
    return selectedAssessment.questions.filter(q => userAnswers[q.id] === undefined).length;
  }, [selectedAssessment, userAnswers]);

  // Trigger submit verification modal
  const handleInitiateSubmit = () => {
    setShowSubmitConfirmModal(true);
  };

  // Actually grade and commit the assessment
  const finalizeAndSubmit = () => {
    if (!selectedAssessment) return;

    setShowSubmitConfirmModal(false);

    let correctCount = 0;
    selectedAssessment.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const totalQuestions = selectedAssessment.questions.length; // 10
    const incorrectCount = totalQuestions - correctCount;
    const score = correctCount * 10; // 10 points per question = max 100
    const percentage = score;
    const skillLevel: AssessmentSkillLevel = getSkillLevelFromScore(score);
    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const passed = score >= selectedAssessment.passingScore; // 70

    const result: AssessmentResult = {
      id: `res-${Date.now()}`,
      assessmentId: selectedAssessment.id,
      category: selectedAssessment.category,
      skillName: selectedAssessment.skillName,
      score,
      totalQuestions,
      correctCount,
      incorrectCount,
      percentage,
      skillLevel,
      timeTakenSeconds,
      passed,
      completedAt: new Date().toISOString(),
      userAnswers
    };

    saveAssessmentResult(result);
    setActiveResult(result);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDurationReadable = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Jump to first unanswered question
  const jumpToFirstUnanswered = () => {
    if (!selectedAssessment) return;
    const firstUnansweredIndex = selectedAssessment.questions.findIndex(q => userAnswers[q.id] === undefined);
    if (firstUnansweredIndex !== -1) {
      setCurrentQuestionIndex(firstUnansweredIndex);
    }
    setShowSubmitConfirmModal(false);
  };

  // Helper to get latest result for a category
  const getLatestResultForCategory = (categoryName: string): AssessmentResult | undefined => {
    return profile.assessmentResults.find(
      r => r.category.toLowerCase() === categoryName.toLowerCase() ||
           r.skillName.toLowerCase() === categoryName.toLowerCase()
    );
  };

  // -------------------------------------------------------------
  // VIEW 1: ACTIVE RESULT PAGE
  // -------------------------------------------------------------
  if (activeResult && selectedAssessment) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Results Banner Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1c] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Accent top line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 ${
            activeResult.passed ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-red-500 to-amber-500'
          }`} />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-semibold text-cyan-400">{activeResult.category}</span>
                <span>·</span>
                <span>Standardized Skill Assessment</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Assessment Results
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Completed on {activeResult.completedAt.split('T')[0]} · Time taken: {formatDurationReadable(activeResult.timeTakenSeconds)}
              </p>
            </div>

            {/* Score Showcase */}
            <div className="text-center sm:text-right shrink-0 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Final Score</div>
              <div className="text-4xl font-extrabold font-mono text-white tabular-nums my-1">
                <span className={activeResult.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                  {activeResult.score}
                </span>
                <span className="text-slate-500 text-lg"> / 100</span>
              </div>
              <div className="flex items-center justify-center sm:justify-end gap-2 mt-1">
                <SkillLevelBadge level={activeResult.skillLevel} showDot />
                <span className="text-xs text-slate-400">({activeResult.percentage}%)</span>
              </div>
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/50">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">Skill Tier</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {activeResult.skillLevel}
              </span>
              <span className="text-[10px] text-slate-500">
                {activeResult.score >= 85 ? 'Top Mastery' : activeResult.score >= 70 ? 'Production Ready' : 'In Development'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/50">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">Correct Answers</span>
              <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block tabular-nums">
                {activeResult.correctCount} of {activeResult.totalQuestions}
              </span>
              <span className="text-[10px] text-slate-500">+{activeResult.correctCount * 10} points</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/50">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">Incorrect</span>
              <span className="text-sm font-bold font-mono text-red-400 mt-1 block tabular-nums">
                {activeResult.incorrectCount} of {activeResult.totalQuestions}
              </span>
              <span className="text-[10px] text-slate-500">{activeResult.incorrectCount * 10} missed points</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/50">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">Verification Status</span>
              <span className={`text-sm font-bold mt-1 block ${activeResult.passed ? 'text-cyan-400' : 'text-slate-400'}`}>
                {activeResult.passed ? 'Verified on Passport' : 'Threshold Not Met'}
              </span>
              <span className="text-[10px] text-slate-500">
                {activeResult.passed ? 'Official Stamp Added' : 'Requires >= 70 pts'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => startAssessment(selectedAssessment)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Assessment</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAssessment(null);
                  setActiveResult(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                All Categories
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('dashboard')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <span>View Dashboard</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setActiveView('passport')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Open Skill Passport</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Question-by-Question Detailed Answer Review */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-400" />
                <span>Question-by-Question Answer Review</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect your submitted responses alongside authoritative technical rationales.
              </p>
            </div>
            <button
              onClick={() => setReviewMode(!reviewMode)}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
            >
              {reviewMode ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          {reviewMode && (
            <div className="space-y-5">
              {selectedAssessment.questions.map((q, idx) => {
                const userChoice = activeResult.userAnswers[q.id];
                const isCorrect = userChoice === q.correctOptionIndex;
                const isAnswered = userChoice !== undefined;

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-5 sm:p-6 transition-all ${
                      isCorrect
                        ? 'border-emerald-900/50 bg-emerald-950/10'
                        : 'border-red-900/50 bg-red-950/10'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Question {idx + 1} of 10
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">({q.category})</span>
                      </div>

                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                        isCorrect ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isCorrect ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Correct (+10 pts)</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            <span>{isAnswered ? 'Incorrect (0 pts)' : 'Unanswered (0 pts)'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-sm font-semibold text-white leading-relaxed mb-3">
                      {q.question}
                    </p>

                    {/* Optional Code Snippet */}
                    {q.codeSnippet && (
                      <div className="my-3 rounded-lg bg-[#050811] border border-slate-800 p-3.5 font-mono text-xs text-cyan-300 overflow-x-auto">
                        <pre><code>{q.codeSnippet}</code></pre>
                      </div>
                    )}

                    {/* 4 Options Grid */}
                    <div className="space-y-2 my-4">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = optIdx === q.correctOptionIndex;
                        const isThisUserPick = optIdx === userChoice;

                        let optionStyle = 'border-slate-800 bg-slate-950/40 text-slate-400';
                        if (isThisCorrect) {
                          optionStyle = 'border-emerald-600 bg-emerald-950/40 text-emerald-200 font-medium';
                        } else if (isThisUserPick && !isCorrect) {
                          optionStyle = 'border-red-600 bg-red-950/40 text-red-200';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${optionStyle}`}
                          >
                            <span className="font-mono font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>
                            {isThisCorrect && (
                              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 shrink-0">
                                Correct Answer
                              </span>
                            )}
                            {isThisUserPick && !isThisCorrect && (
                              <span className="text-[10px] uppercase font-mono font-bold text-red-400 shrink-0">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Educational Technical Explanation */}
                    <div className="mt-4 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-cyan-400 font-semibold block mb-1">
                        Technical Explanation:
                      </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE QUESTION RUNNER (ONE QUESTION AT A TIME)
  // -------------------------------------------------------------
  if (selectedAssessment) {
    const question = selectedAssessment.questions[currentQuestionIndex];
    const totalQuestions = selectedAssessment.questions.length; // 10
    const answeredCount = Object.keys(userAnswers).length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Test Control Header */}
        <div className="sticky top-16 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#080d1a]/95 backdrop-blur-md shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-cyan-400 font-bold">{selectedAssessment.category}</span>
              <span>·</span>
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
              {selectedAssessment.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 15-Minute Countdown Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-bold tabular-nums transition-colors ${
              timeLeftSeconds < 60
                ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse'
                : timeLeftSeconds < 180
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-cyan-300'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={() => setShowExitConfirmModal(true)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress: Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span className="font-mono tabular-nums text-cyan-400 font-semibold">
              {answeredCount} / {totalQuestions} Answered
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-800/60">
            <span className="font-mono uppercase tracking-wider text-slate-400">
              Technical Focus: {question.category}
            </span>
            <span className="font-mono text-cyan-400">10 Points</span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {question.question}
            </h2>

            {/* Code Snippet Box */}
            {question.codeSnippet && (
              <div className="mt-4 rounded-xl bg-[#050811] border border-slate-800 p-4 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest pb-2 mb-2 border-b border-slate-800 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" />
                  <span>Code Snippet</span>
                </div>
                <pre><code>{question.codeSnippet}</code></pre>
              </div>
            )}
          </div>

          {/* 4 Answer Options */}
          <div className="space-y-3 pt-2">
            {question.options.map((option, idx) => {
              const isSelected = userAnswers[question.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(question.id, idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-xs shadow-cyan-950 ring-1 ring-cyan-500/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 font-mono text-xs transition-colors ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                      : 'border-slate-700 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1 leading-relaxed text-xs sm:text-sm">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation & Question Jump Strip */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Numbered Jump Buttons 1-10 */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              {selectedAssessment.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = userAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-8 w-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isCurrent
                        ? 'border border-cyan-400 text-cyan-300 bg-cyan-950/60 shadow-xs'
                        : isAnswered
                        ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                        : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800'
                    }`}
                    title={`Question ${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next & Submit Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleInitiateSubmit}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Submit Strip at Bottom */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
            <span className="text-[11px] text-slate-500">
              Each question is worth 10 points · Max score 100
            </span>
            {currentQuestionIndex < totalQuestions - 1 && (
              <button
                onClick={handleInitiateSubmit}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                Ready to submit early ({answeredCount}/{totalQuestions} answered)?
              </button>
            )}
          </div>
        </div>

        {/* Submit Confirmation Dialog Modal */}
        {showSubmitConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  unansweredCount > 0 ? 'bg-amber-950/40 border-amber-800 text-amber-400' : 'bg-cyan-950/40 border-cyan-800 text-cyan-400'
                }`}>
                  {unansweredCount > 0 ? <AlertTriangle className="h-5 w-5" /> : <FileCheck2 className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {unansweredCount > 0 ? 'Unanswered Questions Warning' : 'Submit Assessment'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {unansweredCount > 0
                      ? `You have ${unansweredCount} unanswered question(s).`
                      : 'All 10 questions have been answered.'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {unansweredCount > 0
                  ? `Any unanswered questions will receive 0 points. Are you sure you want to finalize and grade this assessment now?`
                  : `Are you ready to submit your assessment and calculate your final score and skill level?`}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                {unansweredCount > 0 && (
                  <button
                    onClick={jumpToFirstUnanswered}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    Review Unanswered
                  </button>
                )}
                <button
                  onClick={() => setShowSubmitConfirmModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={finalizeAndSubmit}
                  className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Confirmation Dialog */}
        {showExitConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Exit Active Assessment?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your current answers and remaining timer for this test attempt will be discarded. Are you sure you want to leave?
              </p>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowExitConfirmModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Keep Testing
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirmModal(false);
                    setSelectedAssessment(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Exit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: ASSESSMENT SELECTION PAGE (6 CATEGORY CARDS + HISTORY)
  // -------------------------------------------------------------
  return (
    <div className="space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>ProofSkill Engine</span>
            <span>·</span>
            <span className="text-cyan-400 font-mono">10 Questions · 15 Minutes · Max 100 Pts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <FileCheck2 className="h-7 w-7 text-cyan-400" />
            <span>Standardized Skill Assessments</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pass standardized technical evaluations to earn verifiable credentials on your Skill Passport.
          </p>
        </div>

        {/* Skill Level Threshold Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-500 font-sans font-semibold">Tiers:</span>
          <span className="text-slate-400">0-39: Beginner</span>
          <span className="text-blue-400">40-69: Developing</span>
          <span className="text-cyan-400">70-84: Proficient</span>
          <span className="text-emerald-400">85-100: Advanced</span>
        </div>
      </div>

      {/* 6 Assessment Category Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>Official Assessment Categories (6 Tracks)</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {profile.assessmentResults.filter(r => r.passed).length} of 6 Passed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_ASSESSMENTS.map(assessment => {
            const latestResult = getLatestResultForCategory(assessment.category);
            const isPassed = latestResult?.passed;

            return (
              <div
                key={assessment.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all group hover:border-slate-700 ${
                  isPassed
                    ? 'border-emerald-900/40 bg-slate-900/50 hover:border-emerald-500/50'
                    : 'border-slate-800 bg-slate-900/30'
                }`}
              >
                <div>
                  {/* Category Header & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {assessment.category}
                    </span>

                    {latestResult ? (
                      <div className="flex items-center gap-1.5">
                        <SkillLevelBadge level={latestResult.skillLevel} showDot />
                        <span className="text-xs font-mono font-bold text-white tabular-nums">
                          ({latestResult.score}%)
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Not Attempted
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {assessment.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {assessment.description}
                  </p>

                  {/* Specification Pillows */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      15 Mins
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">10 Questions</span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">10 Pts Each</span>
                  </div>

                  {/* Topics Covered */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">
                      Curriculum:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assessment.topicsCovered.map((topic, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Launch Row */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  {latestResult ? (
                    <div className="text-[11px] text-slate-400">
                      Last tested: <strong className="text-slate-300">{latestResult.completedAt.split('T')[0]}</strong>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 font-mono">
                      Pass mark: 70 pts
                    </div>
                  )}

                  <button
                    onClick={() => startAssessment(assessment)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      isPassed
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>{latestResult ? 'Retake Test' : 'Start Assessment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment History Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="h-4 w-4 text-cyan-400" />
              <span>Assessment History & Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every completed assessment is permanently logged in your local ledger.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {profile.assessmentResults.length} total attempts
          </span>
        </div>

        {profile.assessmentResults.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No assessment attempts on record yet. Select any category above to take your first test.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Date Completed</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Skill Level</th>
                  <th className="py-3 px-3">Time Taken</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {profile.assessmentResults.map(attempt => {
                  const assessment = ALL_ASSESSMENTS.find(a => a.id === attempt.assessmentId || a.category === attempt.category);

                  return (
                    <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3 font-sans font-semibold text-white">
                        {attempt.category || attempt.skillName}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {attempt.completedAt.split('T')[0]}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`font-bold tabular-nums ${attempt.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {attempt.score} / 100
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-sans">
                        <SkillLevelBadge level={attempt.skillLevel} />
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 tabular-nums">
                        {formatDurationReadable(attempt.timeTakenSeconds || 480)}
                      </td>
                      <td className="py-3.5 px-3 font-sans">
                        {attempt.passed ? (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Passed
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Not Passed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-sans">
                        {assessment && (
                          <button
                            onClick={() => {
                              setSelectedAssessment(assessment);
                              setActiveResult(attempt);
                            }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            Review Answers →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
