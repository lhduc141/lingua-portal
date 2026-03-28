export type PlacementQuestionDto = {
  questionId: string;
  passageId: string | null;
  passage: {
    passageId: string;
    title: string | null;
    content: string;
    cefrLevel: string;
  } | null;
  content: {
    stemText: string | null;
    contentJson: string;
  };
  options: Array<{
    optionId: string;
    positionId: number | null;
    text: string | null;
  }>;
};
