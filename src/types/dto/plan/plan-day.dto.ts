import { PlanDayStatus, PlanTaskDto } from "@/types";

export type PlanDayDto = {
  day: number;
  date: string;
  totalTasks: number;
  status: PlanDayStatus;
  tasks: PlanTaskDto[];
};
