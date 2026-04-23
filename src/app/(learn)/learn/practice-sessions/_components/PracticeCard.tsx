"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, FileText, Mic, PenLine } from "lucide-react";
import { cn } from "@/lib";
import type { QuestionSetListItemDto } from "@/types/dto/learn";

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
};

interface PracticeCardProps {
  session: QuestionSetListItemDto;
  onClick: () => void;
  isStarting?: boolean;
  index?: number;
}

export function PracticeCard({
  session,
  onClick,
  isStarting = false,
  index = 0,
}: PracticeCardProps) {
  const skill = SKILL_STYLE[session.skillName] ?? SKILL_STYLE["reading"]!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={isStarting ? undefined : onClick}
      className={cn(
        "relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md",
        isStarting ? "cursor-not-allowed opacity-60" : "border-gray-200"
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
            {session.skillName}
          </span>
          {session.cefrLevel && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                skill.badgeBg,
                skill.badgeText
              )}
            >
              {session.cefrLevel}
            </span>
          )}
        </div>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
            skill.badgeBg,
            skill.badgeText
          )}
        >
          Practice
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 font-serif text-[13px] font-semibold leading-snug text-gray-900">
          {session.title}
        </h3>

        {/* Meta */}
        <div className="mt-auto flex items-center gap-3 text-[10px] text-slate-400">
          {session.estimatedMinutes != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.estimatedMinutes}m
            </span>
          )}
          {session.questionCount > 0 && (
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {session.questionCount}Q
            </span>
          )}
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={isStarting}
          className={cn(
            "mt-1 w-full rounded-lg py-1.5 text-[11px] font-bold transition-all duration-150 disabled:opacity-50",
            `${skill.btnBg} ${skill.btnText} ${skill.btnHover}`
          )}
        >
          {isStarting ? "Starting..." : "Start →"}
        </motion.button>
      </div>
    </motion.div>
  );
}
