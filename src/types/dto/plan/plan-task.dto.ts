export type PlanTaskDto = {
  itemId: string;
  title: string;
  description: string | null;
  rationale: string | null;
  itemType: string;
  refType: string | null;
  refId: string | null;
  status: string;
  estimatedMinutes: number | null;
  skillName: string | null;
  submittedText: string | null;
  taskScore: number | null;
  userFeedback: string | null;
  feedbackSubmittedAt: string | null;
  dueDate: string | null;
};
