// EXERCISE RESULT
export type ExerciseResultDto = {
  exerciseRecordId: string;
  status: "in_progress" | "submitted" | "scored";
  score: number | null;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt: string | null;
  answers: ExerciseAnswerResultDto[];
};

// PRONUNCIATION
export type PronunciationWordResult = {
  word: string;
  accuracyScore: number;
  errorType: string | null;
};

export type PronunciationScores = {
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  prosodyScore?: number | null;
  pronComposite: number;
  estimatedBand: number;
  words: PronunciationWordResult[];
};

// AI FEEDBACK BUILDING BLOCKS
export type CorrectionItem = {
  type: "grammar" | "spelling" | "punctuation" | "formatting" | "duplication" | "vocabulary";
  original: string;
  corrected: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  rule?: string;
};

export type StyleImprovementItem = {
  original: string;
  improved: string;
  explanation: string;
  isMandatory: boolean;
};

export type SubCriterionItem = {
  name: string;
  score: number;
  evidence: string[];
  diagnosis: string;
  howToImprove: string;
  impact?: string;
};

export type CriterionBandItem = {
  name: string;
  bandEstimate: number | null;
  internalScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  subCriteria: SubCriterionItem[];
};

export type PriorityFixItem = {
  priority: number;
  area: string;
  problem: string;
  action: string;
  expectedImpact: string;
};

// AI FEEDBACK
export type AiFeedbackDto = {
  // Assessment metadata
  assessmentType: "writing_task_2" | "speaking" | "dictation" | string | null;
  currentLevel: string | null;
  targetLevel: string | null;
  currentBand: string | null;
  targetBand: string | null;
  currentCefrApproxBand: string | null;
  nextCefrApproxBand: string | null;

  // Word count (writing only)
  wordCount: number;
  wordCountStatus: string;

  // Scores
  estimatedIeltsBand: number | null;
  internalScore: number;
  overallScore: number;
  nextBandTarget: number | null;
  scoreConfidence: "low" | "medium" | "high";
  scoreRationale: string;

  // Grading detail
  criterionBands: CriterionBandItem[];
  corrections: CorrectionItem[];
  styleImprovements: StyleImprovementItem[];
  priorityFixes: PriorityFixItem[];
  nextLevelGaps: string[];
  correctedText: string | null;

  // Pronunciation (speaking only — từ Azure)
  pronunciationScores: PronunciationScores | null;
  pronunciationConfidence: string | null;

  // Legacy fields (backward compat — dictation/old format)
  dimensions?: Array<{ name: string; score: number; feedback: string }>;
  suggestions?: string[];
};

// ANSWER RESULT
export type ExerciseAnswerResultDto = {
  questionId: string;
  questionType: string;
  stemText: string | null;
  isCorrect: boolean | null;
  earnedScore: number | null;
  maxScore: number;
  gradingStatus: string;
  userAnswer: {
    optionIds?: string[];
    optionTexts?: string[];
    textAnswer?: string;
  } | null;
  correctAnswer: {
    optionIds?: string[];
    optionTexts?: string[];
    textAnswers?: string[];
  } | null;
  aiFeedback: AiFeedbackDto | null;
};
