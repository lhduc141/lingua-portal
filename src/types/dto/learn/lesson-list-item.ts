export type LessonListItemDto = {
  lessonId: string;
  skillName: string;
  title: string;
  description: string | null;
  cefrLevel: string | null;
  estimatedMinutes: number | null;
  status: string;
};
