"use client";

import { useCurrentPlan, useGeneratePlan, useUpdatePlanItem } from "@/hooks/plan";
import { PawSpinner } from "@/components/shared/spinner";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Mic,
  PenLine,
  RefreshCw,
  SkipForward,
  Zap,
} from "lucide-react";
import type { PlanDayDto, PlanDayStatus, PlanTaskDto } from "@/types/dto/plan";
import { resetPlan } from "@/services";
import { useQueryClient } from "@tanstack/react-query";

//  Constants ─

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

const SKILL_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  reading: {
    icon: <BookOpen className="h-3 w-3" />,
    label: "READING",
    color: "text-blue-500 bg-blue-50",
  },
  writing: {
    icon: <PenLine className="h-3 w-3" />,
    label: "WRITING",
    color: "text-purple-600 bg-purple-50",
  },
  speaking: {
    icon: <Mic className="h-3 w-3" />,
    label: "SPEAKING",
    color: "text-orange-500 bg-orange-50",
  },
};

const TYPE_LABEL: Record<string, string> = {
  lesson: "Lesson",
  practice_session: "Practice",
  custom_activity: "Custom",
  weekly_review: "Review",
};

//  Sub-components

interface TaskCardProps {
  task: PlanTaskDto;
  onComplete: (itemId: string) => void;
  onSkip: (itemId: string) => void;
  isLoading: boolean;
}

function TaskCard({ task, onComplete, onSkip, isLoading }: TaskCardProps) {
  const router = useRouter();
  const skill = task.skillName ? SKILL_CONFIG[task.skillName] : null;
  const isCompleted = task.status === "completed";
  const isSkipped = task.status === "skipped";
  const isDone = isCompleted || isSkipped;

  // ✅ Xác định route dựa vào itemType + refId
  const getTaskRoute = (): string | null => {
    if (!task.refId) return null;
    if (task.itemType === "lesson") return ROUTES.LEARN.LESSON(task.refId);
    if (task.itemType === "practice_session") return ROUTES.LEARN.PRACTICE_SESSION(task.refId);
    return null;
  };

  const taskRoute = getTaskRoute();

  const handleCardClick = () => {
    if (taskRoute) router.push(taskRoute);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "flex flex-col gap-2 rounded-lg bg-white p-2.5 text-left shadow-sm",
        taskRoute &&
          "cursor-pointer transition-all hover:shadow-md hover:ring-1 hover:ring-teal-200",
        isCompleted && "opacity-75",
        isSkipped && "opacity-50"
      )}
    >
      {/* Header: skill tag + status icon */}
      <div className="flex items-center justify-between">
        {skill ? (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
              skill.color
            )}
          >
            {skill.icon}
            {skill.label}
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
            {TYPE_LABEL[task.itemType] ?? task.itemType}
          </span>
        )}

        {isCompleted ? (
          <CheckCircle2 className="h-3 w-3 text-teal-600" />
        ) : isSkipped ? (
          <SkipForward className="h-3 w-3 text-slate-300" />
        ) : (
          <Circle className="h-3 w-3 text-slate-300" />
        )}
      </div>

      {/* Title */}
      <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-gray-900">
        {task.title}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-semibold text-slate-500">
          {TYPE_LABEL[task.itemType] ?? "Task"}
        </span>
        {task.estimatedMinutes && (
          <span className="flex items-center gap-0.5 text-[8px] font-semibold text-slate-400">
            <Clock className="h-2.5 w-2.5" />
            {task.estimatedMinutes} mins
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="line-clamp-2 text-[8px] font-light leading-relaxed text-slate-400">
          {task.description}
        </p>
      )}

      {/* Actions — stopPropagation để không trigger card click */}
      {!isDone && task.itemType !== "weekly_review" && (
        <div className="flex gap-1 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation(); // ← không bubble lên card click
              onComplete(task.itemId);
            }}
            disabled={isLoading}
            className="flex-1 rounded-md bg-teal-600 py-1 text-[9px] font-bold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            Done
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ← không bubble lên card click
              onSkip(task.itemId);
            }}
            disabled={isLoading}
            className="rounded-md border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-400 hover:bg-gray-50 disabled:opacity-50"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}

interface DayColumnProps {
  planDay: PlanDayDto;
  dayLabel: string;
  isToday: boolean;
  onComplete: (itemId: string) => void;
  onSkip: (itemId: string) => void;
  isLoading: boolean;
}

function DayColumn({ planDay, dayLabel, isToday, onComplete, onSkip, isLoading }: DayColumnProps) {
  const date = new Date(planDay.date);
  const dateNum = date.getDate();
  const isRestDay = planDay.tasks.length === 0;

  return (
    <div className="flex flex-1 flex-col gap-2.5">
      {/* Day header */}
      <div className={cn("text-center", isToday && "font-bold")}>
        <p className={cn("text-[11px] font-semibold text-slate-400", isToday && "text-teal-600")}>
          {dayLabel}
        </p>
        <p className={cn("text-[20px] font-bold text-gray-900", isToday && "text-teal-600")}>
          {dateNum}
        </p>
      </div>

      {/* Tasks or REST DAY */}
      {isRestDay ? (
        <div className="flex min-h-[80px] items-center justify-center rounded-lg bg-slate-50">
          <p className="text-[10px] font-semibold text-slate-400">REST DAY</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {planDay.tasks.map((task) => (
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

//  Empty State

interface EmptyPlanProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

function EmptyPlan({ onGenerate, isGenerating }: EmptyPlanProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-teal-200 bg-teal-50/40 py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
        <Zap className="h-8 w-8 text-teal-600" />
      </div>
      <div className="text-center">
        <h3 className="font-serif text-[24px] text-gray-900">No Plan Yet</h3>
        <p className="mt-1 text-[14px] text-slate-500">
          Generate your personalized AI learning plan to get started.
        </p>
      </div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-[14px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        <Zap className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate My Plan"}
      </button>
    </div>
  );
}

//  Main Page
export default function PlanPage() {
  const { data, isLoading, error } = useCurrentPlan();
  const queryClient = useQueryClient();
  const generateMutation = useGeneratePlan();
  const updateMutation = useUpdatePlanItem();
  const router = useRouter();

  const handleComplete = (itemId: string) => {
    void updateMutation.mutate({ itemId, dto: { status: "completed" } });
  };
  const handleSkip = (itemId: string) => {
    void updateMutation.mutate({ itemId, dto: { status: "skipped" } });
  };
  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync(undefined);
    } catch (err: any) {
      console.error("Generate error:", err?.response?.data);
    }
  };
  const handleReset = async () => {
    try {
      await resetPlan();
      await queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
    } catch (err: any) {
      console.error("Reset error:", err?.response?.data);
    }
  };
  if (isLoading) return <PawSpinner fullScreen />;

  if (!data || error) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-[32px] text-gray-900">My Learning Plan</h1>
        <EmptyPlan onGenerate={handleGenerate} isGenerating={generateMutation.isPending} />
      </div>
    );
  }

  const { planCycle, weekNumber, overallProgress, totalDays, completedDays, days } = data;

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header  */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[32px] text-gray-900">
            Cycle {planCycle} — Week {weekNumber}
          </h1>
          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-4">
            <div className="relative h-3 w-[420px] rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-3 rounded-full bg-[#157868] transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-[14px] font-bold text-slate-400">
              {overallProgress.toFixed(0)}% Complete ({completedDays}/{totalDays} tasks)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(ROUTES.ASSESSMENT.HISTORY)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[14px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Review Plan
          </button>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-[14px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", generateMutation.isPending && "animate-spin")} />
            {generateMutation.isPending ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-[13px] font-medium text-red-400 hover:bg-red-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Grid  */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map(
          (
            planDay: {
              date: any;
              day: any;
              totalTasks?: number;
              status?: PlanDayStatus;
              tasks?: PlanTaskDto[];
            },
            idx: string | number
          ) => (
            <DayColumn
              key={planDay.date}
              planDay={planDay}
              dayLabel={DAY_LABELS[idx] ?? `Day ${planDay.day}`}
              isToday={planDay.date === todayStr}
              onComplete={handleComplete}
              onSkip={handleSkip}
              isLoading={updateMutation.isPending}
            />
          )
        )}
      </div>

      {/* AI Feedback Banner ─ */}
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col justify-between rounded-xl bg-[#1a9d8b] p-6 text-white shadow">
          <div>
            <h2 className="font-serif text-[28px] leading-tight">Keep it up! 🎉</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-white/80">
              Your AI plan is tailored to your pace. Complete today&apos;s tasks to keep your streak
              alive and unlock next week&apos;s content.
            </p>
          </div>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="font-serif text-[28px]">
                {data.totalDays > 0
                  ? `${Math.round((completedDays / data.totalDays) * 7)} Days`
                  : "0 Days"}
              </p>
              <p className="text-[12px] text-white/70">This Week</p>
            </div>
            <div>
              <p className="font-serif text-[28px]">{overallProgress.toFixed(0)}%</p>
              <p className="text-[12px] text-white/70">Progress</p>
            </div>
          </div>
        </div>

        {/* Motivation / streak side panel */}
        <div className="flex w-[300px] shrink-0 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="font-serif text-[20px] text-gray-900">Stay Consistent</h3>
            <p className="mt-2 text-[12px] text-slate-500">
              Daily practice is the key to mastery. Even 15 minutes a day compounds into fluency.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">Keep your streak!</p>
              <p className="text-[11px] text-slate-400">Complete at least 1 task today</p>
            </div>
          </div>
          <button
            onClick={() => router.push(ROUTES.LEARN.ROOT)}
            className="mt-4 w-full rounded-lg bg-teal-50 py-2.5 text-[13px] font-bold text-teal-700 hover:bg-teal-100"
          >
            Browse Lessons →
          </button>
        </div>
      </div>
    </div>
  );
}
