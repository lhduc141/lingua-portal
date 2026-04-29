"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Headphones,
  Mic,
  PenLine,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/config/routes";
import { startPracticeExercise } from "@/services";
import type { PlanTaskDto } from "@/types/dto/plan";

const SKILL_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  reading: {
    icon: <BookOpen className="h-2.5 w-2.5" />,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    bg: "text-blue-200",
  },
  writing: {
    icon: <PenLine className="h-2.5 w-2.5" />,
    color: "text-violet-600 bg-violet-50 border-violet-100",
    bg: "text-violet-200",
  },
  speaking: {
    icon: <Mic className="h-2.5 w-2.5" />,
    color: "text-orange-500 bg-orange-50 border-orange-100",
    bg: "text-orange-200",
  },
  listening: {
    icon: <Headphones className="h-2.5 w-2.5" />,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    bg: "text-emerald-200",
  },
};

const TYPE_CONFIG = {
  lesson: { label: "Lesson", color: "text-blue-500 bg-blue-50 border-blue-100" },
  practice_session: { label: "Practice", color: "text-purple-500 bg-purple-50 border-purple-100" },
  custom_activity: { label: "Activity", color: "text-slate-500 bg-slate-50 border-slate-100" },
};

// Skill icon watermark — large muted icon
const SKILL_ICON_LG: Record<string, React.ReactNode> = {
  reading: <BookOpen className="h-12 w-12" />,
  writing: <PenLine className="h-12 w-12" />,
  speaking: <Mic className="h-12 w-12" />,
  listening: <Headphones className="h-12 w-12" />,
};

interface DayCardProps {
  date: string;
  dayLabel: string;
  isToday: boolean;
  isPast: boolean;
  tasks: PlanTaskDto[];
  hasReview?: boolean;
  reviewTask?: PlanTaskDto | null;
  onComplete: (itemId: string) => void;
  onSkip: (itemId: string) => void;
  onReviewClick: (task: PlanTaskDto) => void;
  isLoading: boolean;
  todayStr: string;
}

export function DayCard({
  date,
  dayLabel,
  isToday,
  isPast,
  tasks,
  onComplete,
  onSkip,
  onReviewClick,
  isLoading,
  todayStr,
  hasReview = false,
  reviewTask,
}: DayCardProps) {
  const router = useRouter();
  const [startingId, setStartingId] = useState<string | null>(null);

  const dateNum = new Date(date + "T12:00:00").getDate();
  const isRestDay = tasks.length === 0;
  const isBeforePlan = isPast && isRestDay;

  const handleStart = async (task: PlanTaskDto) => {
    if (!task.refId || startingId) return;
    if (task.itemType === "lesson") {
      router.push(ROUTES.LEARN.LESSON(task.refId));
      return;
    }
    if (task.itemType === "practice_session") {
      setStartingId(task.itemId);
      try {
        const res = await startPracticeExercise(task.refId);
        const id = res.data?.exerciseRecordId;
        sessionStorage.setItem(`exercise_${id}`, JSON.stringify(res.data));
        router.push(ROUTES.EXERCISE.DETAIL(id));
      } catch {
        setStartingId(null);
      }
    }
  };

  // Header colors
  const headerCls = isToday
    ? "bg-teal-600 text-white"
    : isBeforePlan
      ? "bg-gray-100"
      : isRestDay
        ? "bg-teal-50"
        : "bg-[#F0F7F6]"; // soft teal tint for active

  const dayLabelCls = isToday
    ? "text-teal-100"
    : isBeforePlan
      ? "text-gray-300"
      : isRestDay
        ? "text-teal-400"
        : "text-teal-600";
  const dateNumCls = isToday ? "text-white" : isBeforePlan ? "text-gray-300" : "text-gray-800";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm",
        isToday ? "border-teal-300 ring-2 ring-teal-100" : "border-gray-200",
        isBeforePlan && "opacity-40"
      )}
    >
      <div className={cn("flex items-center justify-between px-3 py-2.5", headerCls)}>
        <div className="flex items-center gap-2">
          <p className={cn("text-[10px] font-bold uppercase tracking-wider", dayLabelCls)}>
            {dayLabel}
          </p>
          <p className={cn("font-serif text-[22px] font-bold leading-none", dateNumCls)}>
            {dateNum}
          </p>
        </div>
        {isToday && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white">
            TODAY
          </span>
        )}
        {isRestDay && !isBeforePlan && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-teal-400">
            Rest
          </span>
        )}
        {hasReview && reviewTask && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReviewClick?.(reviewTask);
            }}
            className="rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold text-teal-700 hover:bg-teal-200"
          >
            REVIEW
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-2.5">
        {isRestDay ? (
          <div className="flex min-h-[60px] flex-col items-center justify-center gap-1">
            <p
              className={cn(
                "text-[11px] font-semibold",
                isBeforePlan ? "text-teal-200" : "text-teal-300"
              )}
            >
              {isBeforePlan ? "—" : "Rest Day"}
            </p>
            {!isBeforePlan && <p className="text-[9px] text-slate-300">No tasks today</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {tasks.map((task) => {
              const skill = task.skillName ? SKILL_CONFIG[task.skillName] : null;
              const typeKey = task.itemType as keyof typeof TYPE_CONFIG;
              const typeCfg = TYPE_CONFIG[typeKey] ?? TYPE_CONFIG.lesson;
              const isCompleted = task.status === "completed";
              const isSkipped = task.status === "skipped";
              const isDone = isCompleted || isSkipped;
              const isCustom = task.itemType === "custom_activity";
              const isOverdue = task.dueDate && task.dueDate < todayStr && !isDone;
              const isStarting = startingId === task.itemId;
              const skillIconLg = task.skillName ? SKILL_ICON_LG[task.skillName] : null;

              return (
                <div
                  key={task.itemId}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-2.5 transition-all",
                    isCompleted
                      ? "border-teal-100 bg-teal-50/40"
                      : isSkipped
                        ? "border-gray-100 bg-gray-50"
                        : isOverdue
                          ? "border-red-200 bg-red-50/20"
                          : "border-gray-100 bg-white hover:border-teal-200 hover:bg-teal-50/20",
                    !isDone && !isCustom && "cursor-pointer"
                  )}
                  onClick={() => !isDone && !isCustom && void handleStart(task)}
                >
                  {/* Watermark icon — only when completed */}
                  {isCompleted && skillIconLg && (
                    <div
                      className={cn(
                        "pointer-events-none absolute right-1 top-1 opacity-[0.07]",
                        skill?.bg
                      )}
                    >
                      {skillIconLg}
                    </div>
                  )}

                  {/* Row 1: badges + meta */}
                  <div className="flex flex-wrap items-center gap-1">
                    {skill && (
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase",
                          skill.color
                        )}
                      >
                        {skill.icon}
                        {task.skillName}
                      </span>
                    )}
                    <span
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-[8px] font-medium",
                        typeCfg.color
                      )}
                    >
                      {typeCfg.label}
                    </span>
                    <div className="flex-1" />
                    {task.estimatedMinutes && (
                      <span className="flex items-center gap-0.5 text-[8px] text-slate-400">
                        <Clock className="h-2.5 w-2.5" />
                        {task.estimatedMinutes}m
                      </span>
                    )}
                    {isOverdue && !isDone && (
                      <span className="rounded-full bg-red-100 px-1 py-0.5 text-[7px] font-bold text-red-500">
                        Late
                      </span>
                    )}
                  </div>

                  {/* Row 2: title */}
                  <p
                    className={cn(
                      "mt-1.5 text-[11px] font-semibold leading-tight",
                      isCompleted
                        ? "text-teal-700"
                        : isSkipped
                          ? "text-slate-400 line-through"
                          : "text-gray-800"
                    )}
                  >
                    {isStarting ? "Starting..." : task.title}
                  </p>

                  {/* Row 3: status or action */}
                  <div className="mt-2">
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-teal-600">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[9px] font-bold">Completed</span>
                      </div>
                    )}
                    {isSkipped && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <SkipForward className="h-3 w-3" />
                        <span className="text-[9px] font-medium">Skipped</span>
                      </div>
                    )}
                    {!isDone && isCustom && (
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(task.itemId);
                          }}
                          disabled={isLoading}
                          className="flex-1 rounded-lg bg-teal-600 py-1 text-[9px] font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                        >
                          Done
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSkip(task.itemId);
                          }}
                          disabled={isLoading}
                          className="rounded-lg border border-gray-200 px-2 py-1 text-[9px] font-semibold text-slate-400 hover:bg-gray-50"
                        >
                          Skip
                        </button>
                      </div>
                    )}
                    {!isDone && !isCustom && (
                      <div className="flex items-center justify-end gap-1 text-teal-600">
                        <span className="text-[9px] font-bold">Start</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
