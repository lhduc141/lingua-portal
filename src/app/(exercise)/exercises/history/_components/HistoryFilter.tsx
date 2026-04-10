"use client";

import { cn } from "@/lib";

type RefTypeFilter = "all" | "lesson" | "question_set";
type SkillFilter = "all" | "reading" | "writing" | "speaking";

interface HistoryFiltersProps {
  refType: RefTypeFilter;
  skill: SkillFilter;
  onRefTypeChange: (v: RefTypeFilter) => void;
  onSkillChange: (v: SkillFilter) => void;
}

const REF_TYPE_OPTIONS: { value: RefTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lesson", label: "Lessons" },
  { value: "question_set", label: "Practice" },
];

const SKILL_OPTIONS: { value: SkillFilter; label: string; color: string }[] = [
  { value: "all", label: "All Skills", color: "" },
  { value: "reading", label: "Reading", color: "text-teal-600" },
  { value: "writing", label: "Writing", color: "text-violet-600" },
  { value: "speaking", label: "Speaking", color: "text-orange-500" },
];

export function HistoryFilters({
  refType,
  skill,
  onRefTypeChange,
  onSkillChange,
}: HistoryFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Type filter */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
        {REF_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onRefTypeChange(opt.value)}
            className={cn(
              "rounded-md px-4 py-1.5 text-[13px] font-medium transition-all",
              refType === opt.value
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-gray-50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Skill filter */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
        {SKILL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSkillChange(opt.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[13px] font-medium transition-all",
              skill === opt.value
                ? "bg-gray-900 text-white shadow-sm"
                : cn("text-slate-500 hover:bg-gray-50", opt.color)
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
