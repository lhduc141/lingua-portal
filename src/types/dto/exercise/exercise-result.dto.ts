// Response từ GET /assessments/:id/result (polling)
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

// AI FEEDBACK TYPES
export type CorrectionItem = {
  type:
    | "grammar"
    | "spelling"
    | "punctuation"
    | "formatting"
    | "duplication";
  original: string;
  corrected: string;
  explanation: string;
  severity: "low" | "medium" | "high";
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
  impact?: string; // optional — da bo khoi prompt moi
  howToImprove: string;
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

export type AiFeedbackDto = {
  assessmentType: "writing_task_2" | "speaking" | "dictation";
  currentLevel: string | null;
  targetLevel: string | null;
  currentBand: string | null;
  targetBand: string | null;
  nextBandTarget: number | null;
  wordCount: number;
  wordCountStatus: string;
  estimatedIeltsBand: number | null;
  internalScore: number;
  overallScore: number;
  scoreConfidence: "low" | "medium" | "high";
  scoreRationale: string;
  criterionBands: CriterionBandItem[];
  corrections: CorrectionItem[];
  styleImprovements: StyleImprovementItem[];
  priorityFixes: PriorityFixItem[];
  nextLevelGaps: string[];
  correctedText: string | null;
  pronunciationConfidence: string | null;
};

// EXERCISE ANSWER RESULT
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
