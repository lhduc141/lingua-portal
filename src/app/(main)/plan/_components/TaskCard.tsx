"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Clock, SkipForward } from "lucide-react";
import { BookOpen, Mic, PenLine } from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/config/routes";
import { startPracticeExercise } from "@/services";
import type { PlanTaskDto } from "@/types/dto/plan";

export const SKILL_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> =
  {
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

export const TYPE_LABEL: Record<string, string> = {
  lesson: "Lesson",
  practice_session: "Practice",
  custom_activity: "Custom",
  weekly_review: "Review",
};

interface TaskCardProps {
  task: PlanTaskDto;
  onComplete: (itemId: string) => void;
  onSkip: (itemId: string) => void;
  isLoading: boolean;
}

export function TaskCard({ task, onComplete, onSkip, isLoading }: TaskCardProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const skill = task.skillName ? SKILL_CONFIG[task.skillName] : null;
  const isCompleted = task.status === "completed";
  const isSkipped = task.status === "skipped";
  const isDone = isCompleted || isSkipped;
  const isClickable =
    !!task.refId && (task.itemType === "lesson" || task.itemType === "practice_session");

  const handleCardClick = async () => {
    if (!task.refId || isStarting) return;

    if (task.itemType === "lesson") {
      router.push(ROUTES.LEARN.LESSON(task.refId));
      return;
    }

    if (task.itemType === "practice_session") {
      setIsStarting(true);
      try {
        const res = await startPracticeExercise(task.refId);
        const exerciseRecordId = res.data?.exerciseRecordId;
        sessionStorage.setItem(`exercise_${exerciseRecordId}`, JSON.stringify(res.data));
        router.push(ROUTES.EXERCISE.DETAIL(exerciseRecordId));
      } catch (err) {
        console.error("Failed to start practice from plan:", err);
        setIsStarting(false);
      }
    }
  };

  return (
    <div
      onClick={() => {
        void handleCardClick();
      }}
      className={cn(
        "flex flex-col gap-2 rounded-lg bg-white p-2.5 text-left shadow-sm",
        isClickable &&
          !isStarting &&
          "cursor-pointer transition-all hover:shadow-md hover:ring-1 hover:ring-teal-200",
        isStarting && "cursor-wait opacity-70",
        isCompleted && "opacity-75",
        isSkipped && "opacity-50"
      )}
    >
      {/* Header */}
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
        {isStarting ? "Starting..." : task.title}
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

      {/* Actions */}
      {!isDone && task.itemType !== "weekly_review" && (
        <div className="flex gap-1 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.itemId);
            }}
            disabled={isLoading}
            className="flex-1 rounded-md bg-teal-600 py-1 text-[9px] font-bold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            Done
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
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
