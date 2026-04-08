import { QuestionItemDto } from "@/types/dto/learn/question-item";

export type QuestionSetDetailDto = {
  questionSetId: string;
  skillName: string;
  title: string;
  description: string | null;
  cefrLevel: string | null;
  estimatedMinutes: number | null;
  isActive: boolean;
  questions: QuestionItemDto[];
};
