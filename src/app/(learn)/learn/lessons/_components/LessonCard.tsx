"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Mic,
  PenLine,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib";
import type { LessonListItemDto } from "@/types/dto/learn";

const SKILL_STYLE: Record<
  string,
  {
    header: string;
    badgeBg: string;
    badgeText: string;
    btnBg: string;
    btnText: string;
    btnHover: string;
    icon: React.ReactNode;
  }
> = {
  reading: {
    header: "bg-blue-50",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    btnBg: "bg-blue-50",
    btnText: "text-blue-700",
    btnHover: "hover:bg-blue-600 hover:text-white",
    icon: <BookOpen className="h-3 w-3 text-blue-600" />,
  },
  writing: {
    header: "bg-violet-50",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    btnBg: "bg-violet-50",
    btnText: "text-violet-700",
    btnHover: "hover:bg-violet-600 hover:text-white",
    icon: <PenLine className="h-3 w-3 text-violet-600" />,
  },
  speaking: {
    header: "bg-orange-50",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
    btnBg: "bg-orange-50",
    btnText: "text-orange-600",
    btnHover: "hover:bg-orange-500 hover:text-white",
    icon: <Mic className="h-3 w-3 text-orange-500" />,
  },
  listening: {
    header: "bg-sky-50",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    btnBg: "bg-sky-50",
    btnText: "text-sky-700",
    btnHover: "hover:bg-sky-600 hover:text-white",
    icon: <Headphones className="h-3 w-3 text-sky-600" />,
  },
};

interface LessonCardProps {
  lesson: LessonListItemDto & { questionCount?: number };
  onClick: () => void;
  isInPlan?: boolean;
  index?: number;
}

export function LessonCard({ lesson, onClick, isInPlan = false, index = 0 }: LessonCardProps) {
  const skill = SKILL_STYLE[lesson.skillName] ?? SKILL_STYLE["reading"]!;

  const isCompleted = lesson.userProgress?.isCompleted ?? false;
  const bestScore = lesson.userProgress?.bestScore;
  const attemptCount = lesson.userProgress?.attemptCount ?? 0;
  const questionCount = lesson.questionCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md",
        isCompleted ? "border-teal-200" : "border-gray-200"
      )}
    >
      {/* Soft colored header */}
      <div className={cn("flex items-center justify-between px-3 py-2", skill.header)}>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
              skill.badgeBg,
              skill.badgeText
            )}
          >
            {skill.icon}
            {lesson.skillName}
          </span>
          {lesson.cefrLevel && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                skill.badgeBg,
                skill.badgeText
              )}
            >
              {lesson.cefrLevel}
            </span>
          )}
        </div>

        {/* Right badge */}
        {isCompleted ? (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
              skill.badgeBg,
              skill.badgeText
            )}
          >
            <CheckCircle2 className="h-2.5 w-2.5" />
            {bestScore !== null && bestScore !== undefined ? `${Math.round(bestScore)}%` : "Done"}
          </span>
        ) : isInPlan ? (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold",
              skill.badgeBg,
              skill.badgeText
            )}
          >
            <Star className="h-2.5 w-2.5" />
            In Plan
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 font-serif text-[13px] font-semibold leading-snug text-gray-900">
          {lesson.title}
        </h3>

        <div className="mt-auto flex items-center gap-3 text-[10px] text-slate-400">
          {lesson.estimatedMinutes != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.estimatedMinutes}m
            </span>
          )}
          {questionCount != null && questionCount > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {questionCount} Questions
            </span>
          )}
          {attemptCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {attemptCount} Attempt
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "duration-350 mt-1 w-full rounded-lg py-1.5 text-[11px] font-bold transition-all",
            isCompleted
              ? "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white"
              : `${skill.btnBg} ${skill.btnText} ${skill.btnHover}`
          )}
        >
          {isCompleted ? "Review →" : "Start →"}
        </motion.button>
      </div>
    </motion.div>
  );
}