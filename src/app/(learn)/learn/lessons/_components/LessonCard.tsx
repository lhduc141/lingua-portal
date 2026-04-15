"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, FileText, Mic, PenLine, Star } from "lucide-react";
import { cn } from "@/lib";
import type { LessonListItemDto } from "@/types/dto/learn";

const SKILL_STYLE: Record<string, { bar: string; badge: string; glow: string; icon: React.ReactNode }> = {
  reading: {
    bar: "bg-teal-600",
    badge: "bg-teal-50 text-teal-700",
    glow: "hover:shadow-teal-100",
    icon: <BookOpen className="h-3 w-3" />,
  },
  writing: {
    bar: "bg-violet-600",
    badge: "bg-violet-50 text-violet-700",
    glow: "hover:shadow-violet-100",
    icon: <PenLine className="h-3 w-3" />,
  },
  speaking: {
    bar: "bg-orange-500",
    badge: "bg-orange-50 text-orange-600",
    glow: "hover:shadow-orange-100",
    icon: <Mic className="h-3 w-3" />,
  },
};

interface LessonCardProps {
  lesson: LessonListItemDto;
  onClick: () => void;
  isInPlan?: boolean;
  index?: number;
}

export function LessonCard({ lesson, onClick, isInPlan = false, index = 0 }: LessonCardProps) {
  const skill = SKILL_STYLE[lesson.skillName] ?? SKILL_STYLE["reading"]!;

  const isCompleted   = lesson.userProgress?.isCompleted ?? false;
  const bestScore     = lesson.userProgress?.bestScore;
  const attemptCount  = lesson.userProgress?.attemptCount ?? 0;
  const lastAttemptAt = lesson.userProgress?.lastAttemptAt;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.012 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white",
        "shadow-sm transition-shadow duration-300",
        skill.glow,
        isCompleted
          ? "border-green-200 hover:shadow-green-100 hover:shadow-md"
          : "border-gray-200 hover:shadow-md"
      )}
    >
      {/* Animated top bar */}
      <motion.div
        className={cn("h-1.5 w-full origin-left", skill.bar)}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: index * 0.04 + 0.1 }}
      />

      {/* Completed watermark */}
      {isCompleted && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center opacity-[0.10]">
            <div className="absolute h-[96px] w-[96px] rounded-full border-[6px] border-green-600" />
            <div className="absolute h-[76px] w-[76px] rounded-full border-[2px] border-green-600" />
            <CheckCircle2 className="h-12 w-12 text-green-600" strokeWidth={2.5} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", skill.badge)}>
            {skill.icon}
            {lesson.skillName}
          </span>
          {lesson.cefrLevel && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
              {lesson.cefrLevel}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-[15px] font-semibold leading-snug text-gray-900 line-clamp-2">
          {lesson.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {lesson.estimatedMinutes != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.estimatedMinutes} mins
            </span>
          )}
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Theory + Questions
          </span>
        </div>

        {/* Attempt info */}
        {isCompleted && (
          <p className="text-[11px] text-slate-400">
            {attemptCount} {attemptCount === 1 ? "attempt" : "attempts"}
            {lastAttemptAt && ` · Last: ${formatDate(lastAttemptAt)}`}
          </p>
        )}

        {/* Bottom action row */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          {isCompleted ? (
            <span className="flex items-center gap-1 rounded-md bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {bestScore !== null && bestScore !== undefined ? `${Math.round(bestScore)}%` : "DONE"}
            </span>
          ) : isInPlan ? (
            <span className="flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
              <Star className="h-3.5 w-3.5" />
              IN YOUR PLAN
            </span>
          ) : (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              NEW
            </span>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-lg border px-4 py-1.5 text-[12px] font-bold transition-colors",
              isCompleted
                ? "border-green-300 text-green-700 hover:bg-green-50"
                : isInPlan
                  ? "border-transparent bg-teal-600 text-white hover:bg-teal-700"
                  : "border-teal-600 text-teal-600 hover:bg-teal-50"
            )}
          >
            {isCompleted ? "Review →" : "Start →"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}