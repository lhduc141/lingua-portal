import { Calendar, Clock, FileText } from "lucide-react";
import { cn } from "@/lib";
import type { LessonDetailDto } from "@/types/dto/learn";

const SKILL_BAR: Record<string, string> = {
  reading: "bg-teal-600",
  writing: "bg-violet-600",
  speaking: "bg-vermilion-500",
  listening: "bg-emerald-500",
};

const SKILL_BADGE: Record<string, string> = {
  reading: "bg-teal-50 text-teal-700",
  writing: "bg-violet-50 text-violet-700",
  speaking: "bg-vermilion-50 text-vermilion-500",
  listening: "bg-emerald-50 text-emerald-700",
};

interface LessonHeaderCardProps {
  lesson: LessonDetailDto;
  onStart: () => void;
  isStarting: boolean;
}

export function LessonHeaderCard({ lesson, onStart, isStarting }: LessonHeaderCardProps) {
  const bar = SKILL_BAR[lesson.skillName] ?? "bg-teal-600";
  const badge = SKILL_BADGE[lesson.skillName] ?? "bg-teal-50 text-teal-700";
  const questionCount = lesson.questions.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Left accent bar */}
      <div className="flex">
        <div className={cn("w-3 shrink-0", bar)} />

        <div className="flex flex-1 flex-col gap-4 p-8">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                badge
              )}
            >
              {lesson.skillName}
            </span>
            {lesson.cefrLevel && (
              <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
                {lesson.cefrLevel}
              </span>
            )}
            <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
              Lesson
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[36px] leading-tight text-gray-900">{lesson.title}</h1>

          {/* Description */}
          {lesson.description && (
            <p className="max-w-2xl text-[18px] leading-relaxed text-slate-500">
              {lesson.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-6 text-[14px] text-slate-500">
            {lesson.estimatedMinutes != null && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {lesson.estimatedMinutes} mins
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {questionCount} Questions
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Theory included
            </span>
          </div>

          {/* Divider + Action */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            {/* Prerequisites */}
            {lesson.prerequisites.length > 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[14px] text-amber-600">
                <span>⚠️</span>
                <span>Recommended: Complete {lesson.prerequisites[0]} first</span>
              </div>
            ) : (
              <div />
            )}

            <button
              onClick={onStart}
              disabled={isStarting}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-[16px] font-bold text-white shadow-md hover:bg-teal-700 disabled:opacity-60"
            >
              {isStarting ? "Starting..." : "Start Lesson →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
