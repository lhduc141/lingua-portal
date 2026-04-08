// Item trong list history từ GET /assessments/history
export type ExerciseHistoryItemDto = {
  exerciseRecordId: string;
  refType: "lesson" | "question_set" | "placement_test";
  refId: string | null;
  title: string | null;
  skillName: string | null;
  status: "in_progress" | "submitted" | "scored";
  score: number | null;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt: string | null;
};
