// Response từ POST /assessments/:id/complete
export type ExerciseCompleteDto = {
  status: "scored" | "submitted";
  score: number | null;
  totalQuestions: number;
  correctCount: number;
  hasPendingSubjective: boolean;
};
