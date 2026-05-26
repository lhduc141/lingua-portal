import type { PronunciationScores } from "@/types";

export type SubmitExerciseAnswerDto = {
  questionId: string;
  answer: {
    optionIds?: string[];
    textAnswer?: string;
    pronunciationScores?: PronunciationScores | null; 
  };
};

export type SubmitAnswerResponseDto = {
  answerId: string;
  gradingStatus: "pending";
};
