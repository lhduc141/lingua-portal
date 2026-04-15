"use client";

import { useRouter } from "next/navigation";
import { BookOpen, PenLine, Mic, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib";
import { ROUTES } from "@/config";
import type { ExerciseHistoryItemDto } from "@/types";

const SKILL_CONFIG = {
  reading: {
    icon: BookOpen,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-l-teal-500",
    label: "READING",
  },
  writing: {
    icon: PenLine,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-l-violet-500",
    label: "WRITING",
  },
  speaking: {
    icon: Mic,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-l-orange-500",
    label: "SPEAKING",
  },
} as const;

const SCORE_CONFIG = {
  mastery: { label: "MASTERY", className: "text-green-600" },
  proficient: { label: "PROFICIENT", className: "text-amber-500" },
  developing: { label: "DEVELOPING", className: "text-red-500" },
  pending: { label: "AI Grading…", className: "text-slate-400" },
} as const;

function getScoreTier(score: number | null, status: string) {
  if (status === "in_progress" || status === "submitted") return "pending";
  if (score === null) return "pending";
  if (score >= 80) return "mastery";
  if (score >= 60) return "proficient";
  return "developing";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface HistoryItemProps {
  item: ExerciseHistoryItemDto;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const router = useRouter();
  const skill = (item.skillName ?? "reading") as keyof typeof SKILL_CONFIG;
  const cfg = SKILL_CONFIG[skill] ?? SKILL_CONFIG.reading;
  const tier = getScoreTier(item.score, item.status);
  const scoreCfg = SCORE_CONFIG[tier];
  const Icon = cfg.icon;

  const handleClick = () => {
    router.push(ROUTES.EXERCISE.RESULT(item.exerciseRecordId));
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-xl border border-l-4 border-gray-200 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md",
        cfg.border
      )}
    >
      {/* Skill icon */}
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", cfg.bg)}>
        <Icon className={cn("h-5 w-5", cfg.color)} />
      </div>

      {/* Main info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", cfg.color)}>
            {cfg.label}
          </span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
            {item.refType === "lesson" ? "LESSON" : "PRACTICE"}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[15px] font-semibold text-gray-900">
          {item.title ?? "Untitled Exercise"}
        </p>
        <div className="mt-1 flex items-center gap-3 text-[12px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(item.startedAt)}
          </span>
          {item.status === "scored" && (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {item.correctCount}/{item.totalQuestions} correct
            </span>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="shrink-0 text-right">
        {tier === "pending" ? (
          <p className="animate-pulse text-[13px] font-semibold text-slate-400">AI Grading…</p>
        ) : (
          <>
            <p className={cn("font-serif text-[28px] font-bold leading-none", scoreCfg.className)}>
              {item.score}%
            </p>
            <p className={cn("mt-0.5 text-[10px] font-bold tracking-widest", scoreCfg.className)}>
              {scoreCfg.label}
            </p>
          </>
        )}
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
