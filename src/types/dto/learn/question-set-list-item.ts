export type QuestionSetListItemDto = {
  questionSetId: string;
  skillName: string;
  title: string;
  description: string | null;
  cefrLevel: string | null;
  estimatedMinutes: number | null;
  isActive: boolean;
  questionCount: number;
};
