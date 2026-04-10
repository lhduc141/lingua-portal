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

export type CorrectionItem = {
  original: string;
  corrected: string;
  rule?: string;
};

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

  aiFeedback: {
    overallScore: number;
    dimensions: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
    corrections: CorrectionItem[];
    suggestions: string[];
  } | null;
};
