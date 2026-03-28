export type StreakDto = {
  currentDays: number;
  longestDays: number;
  lastActiveDate: string | null;

  activityCalendar: Array<{
    date: string;
    assessmentCount: number;
    planItemsCompleted: number;
    totalStudyMinutes: number;
  }>;
};
