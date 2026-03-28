import { PlacementQuestionDto } from "@/types";

export type PlacementStartDto = {
  // assessmentId: string;
  sessionId: string;
  exerciseRecordId: string;
  firstQuestion: PlacementQuestionDto;
  config: {
    minQuestions: number;
    maxQuestions: number;
    targetSe: number;
    initialTheta: number;
  };
};
