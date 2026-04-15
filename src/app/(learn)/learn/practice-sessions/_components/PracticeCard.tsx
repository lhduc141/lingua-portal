import { BookOpen, Clock, FileText, Mic, PenLine } from "lucide-react";
import { cn } from "@/lib";
import type { QuestionSetListItemDto } from "@/types/dto/learn";

const SKILL_STYLE: Record<string, { bar: string; badge: string; icon: React.ReactNode }> = {
  reading: {
    bar: "bg-teal-600",
    badge: "bg-teal-50 text-teal-700",
    icon: <BookOpen className="h-3 w-3" />,
  },
  writing: {
    bar: "bg-violet-600",
    badge: "bg-violet-50 text-violet-700",
    icon: <PenLine className="h-3 w-3" />,
  },
  speaking: {
    bar: "bg-vermilion-500",
    badge: "bg-vermilion-50 text-vermilion-500",
    icon: <Mic className="h-3 w-3" />,
  },
};

interface PracticeCardProps {
  session: QuestionSetListItemDto;
  onClick: () => void;
  isStarting?: boolean;
}

export function PracticeCard({ session, onClick, isStarting = false }: PracticeCardProps) {
  const skill = SKILL_STYLE[session.skillName] ?? SKILL_STYLE["reading"]!;

  return (
    <div
      onClick={isStarting ? undefined : onClick}
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all",
        isStarting ? "cursor-not-allowed opacity-60" : "hover:border-teal-300 hover:shadow-md"
      )}
    >
      <div className={cn("h-1.5 w-full", skill.bar)} />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              skill.badge
            )}
          >
            {skill.icon}
            {session.skillName}
          </span>
          {session.cefrLevel && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
              {session.cefrLevel}
            </span>
          )}
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
            Practice
          </span>
        </div>

        <h3 className="font-serif text-[18px] leading-snug text-gray-900">{session.title}</h3>

        <div className="flex items-center gap-4 text-[12px] text-slate-500">
          {session.estimatedMinutes != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.estimatedMinutes} mins
            </span>
          )}
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {session.questionCount} Questions
          </span>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 pt-3">
          <button
            disabled={isStarting}
            className="rounded-lg border border-teal-600 px-4 py-1.5 text-[12px] font-bold text-teal-600 hover:bg-teal-50 disabled:opacity-50"
          >
            {isStarting ? "Starting..." : "Start →"}
          </button>
        </div>
      </div>
    </div>
  );
}
