import { PlacementQuestionDto, PlacementResultDto } from "@/types";

export type SubmitPlacementAnswerDto = {
  exerciseRecordId: string;
  questionId: string;
  selectedOptionId: string;
  responseTimeMs?: number;
};

export type PlacementAnswerDto = {
  isCorrect: boolean;
  updatedTheta: number;
  updatedSe: number;
  isCompleted: boolean;
  progress: {
    questionsAnswered: number;
    minQuestions: number;
    maxQuestions: number;
  };
  nextQuestion?: PlacementQuestionDto;
  result?: PlacementResultDto;
};
