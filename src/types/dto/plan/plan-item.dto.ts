import { PlanTaskStatus } from "@/types";

export type PlanItemDto = {
  itemId: string;
  itemType: string;
  refType: string | null;
  refId: string | null;

  title: string;
  description: string | null;
  skillName: string | null;
  cefrLevel: string | null;
  estimatedMinutes: number | null;
  status: PlanTaskStatus;
  taskScore: number | null;
  scheduleDate: string | null;
  planCycle: number | null;
  planWeek: string | null;
  weekDay: string | null;
  dueDay: string | null;
  completedAt: string | null;
};
