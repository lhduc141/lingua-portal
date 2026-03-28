import { PlacementQuestionDto } from "@/types";

export type PlacementSessionData = {
  // assessmentId: string;
  sessionId: string;
  exerciseRecordId: string;
  currentQuestion: PlacementQuestionDto;
  questionOrder: number;
  progress: {
    questionsAnswered: number;
    minQuestions: number;
    maxQuestions: number;
  };
};
