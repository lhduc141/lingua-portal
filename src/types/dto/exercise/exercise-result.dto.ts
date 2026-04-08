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

export type ExerciseAnswerResultDto = {
  questionId: string;
  questionType: string;
  isCorrect: boolean | null;
  earnedScore: number | null;
  maxScore: number;
  userAnswer: {
    optionIds?: string[];
    textAnswer?: string;
  } | null;
  correctAnswer: {
    optionIds?: string[];
    textAnswers?: string[];
  } | null;
  aiFeedback: {
    overallScore: number;
    dimensions: Array<{
      name: string;
      score: number;
      feedback: string;
    }>;
    corrections: string[];
    suggestions: string[];
  } | null;
};
