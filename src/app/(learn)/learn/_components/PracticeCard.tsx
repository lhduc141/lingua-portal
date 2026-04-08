import { Clock, FileText } from "lucide-react";
import { cn } from "@/lib";
import type { QuestionSetListItemDto } from "@/types/dto/learn";
import { SKILL_STYLE } from "./_skill-style";

interface PracticeCardProps {
  session: QuestionSetListItemDto;
  onClick: () => void;
}

export function PracticeCard({ session, onClick }: PracticeCardProps) {
  const skill = SKILL_STYLE[session.skillName] ?? SKILL_STYLE["reading"]!;

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
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
          <button className="rounded-lg border border-teal-600 px-4 py-1.5 text-[12px] font-bold text-teal-600 hover:bg-teal-50">
            Start →
          </button>
        </div>
      </div>
    </div>
  );
}
