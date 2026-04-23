"use client";

import { cn } from "@/lib";
import type { PlanDayStatus, PlanTaskDto } from "@/types/dto/plan";
import { TaskCard } from "./TaskCard";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

interface DayColumnProps {
  planDay: {
    date: string;
    day: number;
    totalTasks?: number;
    status?: PlanDayStatus;
    tasks?: PlanTaskDto[];
  };
  isToday: boolean;
  onComplete: (itemId: string) => void;
  onSkip: (itemId: string) => void;
  onReviewClick: (task: PlanTaskDto) => void;
  isLoading: boolean;
  todayStr: string;
}

export function DayColumn({
  planDay,
  isToday,
  onComplete,
  onSkip,
  onReviewClick,
  isLoading,
  todayStr,
}: DayColumnProps) {
  // Derive label từ date thực tế — tránh timezone shift bằng T12:00:00
  const dateObj = new Date(planDay.date + "T12:00:00");
  const dayLabel = DAY_NAMES[dateObj.getDay()];
  const dateNum = dateObj.getDate();

  const tasks = planDay.tasks ?? [];
  const isRestDay = tasks.length === 0;

  return (
    <div className="flex flex-1 flex-col gap-2.5">
      {/* Day header */}
      <div className="text-center">
        <p className={cn("text-[11px] font-semibold text-slate-400", isToday && "text-teal-600")}>
          {dayLabel}
        </p>
        <p className={cn("text-[20px] font-bold text-gray-900", isToday && "text-teal-600")}>
          {dateNum}
        </p>
      </div>

      {/* Content */}
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
              onReviewClick={onReviewClick}
              isLoading={isLoading}
              todayStr={todayStr}
            />
          ))}
        </div>
      )}
    </div>
  );
}
