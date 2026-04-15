"use client";

import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";
import { cn } from "@/lib";

const SKILL_FILTERS = [
  { value: "", label: "All Skills", activeClass: "bg-gray-700 text-white" },
  { value: "reading", label: "Reading", activeClass: "bg-teal-600 text-white" },
  { value: "writing", label: "Writing", activeClass: "bg-violet-600 text-white" },
  { value: "speaking", label: "Speaking", activeClass: "bg-orange-500 text-white" },
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
  search: string;
  planOnly: boolean;
  onSkillChange: (skill: string) => void;
  onCefrChange: (cefr: string) => void;
  onSearchChange: (v: string) => void;
  onPlanOnlyToggle: () => void;
}

export function LearnFilters({
  skillFilter,
  cefrFilter,
  search,
  planOnly,
  onSkillChange,
  onCefrChange,
  onSearchChange,
  onPlanOnlyToggle,
}: LearnFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-between gap-4"
    >
      {/* Skill chips */}
      <div className="flex items-center gap-2">
        {SKILL_FILTERS.map((f, i) => (
          <motion.button
            key={f.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSkillChange(f.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-200",
              skillFilter === f.value
                ? f.activeClass + " shadow-sm"
                : "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50"
            )}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPlanOnlyToggle}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all duration-200",
            planOnly
              ? "border-teal-600 bg-teal-600 text-white shadow-sm"
              : "border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100"
          )}
        >
          <CalendarDays className="h-3.5 w-3.5" />
          Your Plan
        </motion.button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lessons..."
            className="h-9 w-48 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[13px] outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <select
          value={cefrFilter}
          onChange={(e) => onCefrChange(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
        >
          {CEFR_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
