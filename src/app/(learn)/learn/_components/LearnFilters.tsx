"use client";

import { cn } from "@/lib";

const SKILL_FILTERS = [
  { value: "", label: "All Skills" },
  { value: "reading", label: "Reading" },
  { value: "writing", label: "Writing" },
  { value: "speaking", label: "Speaking" },
] as const;

const CEFR_FILTERS = [
  { value: "", label: "All Levels" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
] as const;

interface LearnFiltersProps {
  skillFilter: string;
  cefrFilter: string;
  onSkillChange: (skill: string) => void;
  onCefrChange: (cefr: string) => void;
}

export function LearnFilters({
  skillFilter,
  cefrFilter,
  onSkillChange,
  onCefrChange,
}: LearnFiltersProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        {SKILL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onSkillChange(f.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors",
              skillFilter === f.value
                ? "bg-teal-600 text-white"
                : "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <select
        value={cefrFilter}
        onChange={(e) => onCefrChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-800 outline-none focus:ring-2 focus:ring-teal-500"
      >
        {CEFR_FILTERS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
