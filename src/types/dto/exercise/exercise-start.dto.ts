export type ExerciseStartDto = {
  exerciseRecordId: string;
  refType: "lesson" | "question_set";
  totalQuestions: number;
  lesson?: {
    lessonId: string;
    title: string;
    skillName: string;
    cefrLevel: string | null;
    estimatedMinutes: number | null;
    theoryContent: unknown;
  };
  questionSet?: {
    questionSetId: string;
    title: string;
    skillName: string;
    cefrLevel: string | null;
    estimatedMinutes: number | null;
  };
  questions: AssessmentQuestionDto[];
};

export type AssessmentQuestionDto = {
  questionId: string;
  type: "mcq_single" | "mcq_multi" | "fill_blank" | "essay" | "speaking" | "matching" | "dictation"; 
  position: number;
  maxScore: number;
  stemText: string | null;
  contentJson: unknown | null;
  passage: {
    passageId: string;
    title: string;
    content: string;
    cefrLevel: string;
    wordCount: string | null;
    audioUrl: string | null;
  } | null;
  options: Array<{
    optionId: string;
    position: number;
    text: string | null;
  }>;
};
