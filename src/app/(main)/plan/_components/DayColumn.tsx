import { cn } from "@/lib/cn";
import type { PlanDayDto, PlanDayStatus, PlanTaskDto } from "@/types/dto/plan";
import { TaskCard } from "./TaskCard";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

interface DayColumnProps {
  planDay: {
    date: string;
    day: number;
    totalTasks?: number;
    status?: PlanDayStatus;
    tasks?: PlanTaskDto[];
  };
  idx: number;
  isToday: boolean;
  onComplete: (itemId: string) => void;
  onSkip: (itemId: string) => void;
  isLoading: boolean;
}

export function DayColumn({
  planDay,
  idx,
  isToday,
  onComplete,
  onSkip,
  isLoading,
}: DayColumnProps) {
  const date = new Date(planDay.date);
  const dateNum = date.getDate();
  const tasks = planDay.tasks ?? [];
  const isRestDay = tasks.length === 0;

  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <div className={cn("text-center", isToday && "font-bold")}>
        <p className={cn("text-[11px] font-semibold text-slate-400", isToday && "text-teal-600")}>
          {DAY_LABELS[idx] ?? `Day ${planDay.day}`}
        </p>
        <p className={cn("text-[20px] font-bold text-gray-900", isToday && "text-teal-600")}>
          {dateNum}
        </p>
      </div>

      {isRestDay ? (
        <div className="flex min-h-[80px] items-center justify-center rounded-lg bg-slate-50">
          <p className="text-[10px] font-semibold text-slate-400">REST DAY</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.itemId}
              task={task}
              onComplete={onComplete}
              onSkip={onSkip}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
