import { PlanDayDto } from "@/types";

export type CurrentPlanDto = {
  planCycle: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  completedDays: number;
  overallProgress: number; // 0–100
  days: PlanDayDto[];
};
