import { SkillSummaryItem } from "@/types/dto/dashboard/skill-summary-item.dto";
import { RecentActivityItem } from "@/types/dto/dashboard/recent-activity-item.dto";

export type DashboardOverviewDto = {
  cefrLevel: string | null;
  cefrConfidence: number | null;
  currentPlanCycle: number | null;

  planProgress: {
    totalItems: number;
    completedItems: number;
    percentage: number;
  } | null;

  skillSummary: Record<"reading" | "writing" | "speaking", SkillSummaryItem>;
  streak: {
    currentDays: number;
    longestDays: number;
  };

  vocabularyCount: number;
  totalAssessments: number;
  totalStudyMinutes: number;
  recentActivity: RecentActivityItem[];

  lessonsCompleted: number; 
  practiceCompleted: number;
};
