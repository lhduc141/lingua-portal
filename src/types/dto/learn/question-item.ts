import { PassageBrief } from "@/types/dto/learn/passage-brief";
import { QuestionOption } from "@/types/dto/learn/question-option";

export type QuestionItemDto = {
  questionId: string;
  position: number;
  type: "mcq_single" | "mcq_multi" | "fill_blank" | "essay" | "speaking" | "matching";
  difficulty: number;
  maxScore: number;
  stemText: string | null;
  contentJson: unknown | null;
  passage: PassageBrief | null;
  options: QuestionOption[];
};
