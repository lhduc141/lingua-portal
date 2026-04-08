// Request DTO - submit answer cho 1 câu hỏi
export type SubmitExerciseAnswerDto = {
  questionId: string;
  answer: {
    optionIds?: string[]; // mcq_single/mcq_multi
    textAnswer?: string; // essay/speaking/fill_blank
  };
};

// Response DTO - backend trả về sau khi submit
export type SubmitAnswerResponseDto = {
  answerId: string;
  gradingStatus: "pending";
};
