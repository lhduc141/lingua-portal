export type LessonDetailDto = {
  lessonId: string;
  skillName: string;
  title: string;
  description: string | null;
  cefrLevel: string | null;
  estimatedMinutes: number | null;
  theoryContent: TheoryContent | null;
  prerequisites: string[];
  questions: QuestionItemDto[];
};
