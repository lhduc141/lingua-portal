"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib";

type Tab = "lessons" | "practice";

interface LearnHeaderProps {
  activeTab: Tab;
  lessonCount: number | undefined;
  practiceCount: number | undefined;
  search: string;
  onTabChange: (tab: Tab) => void;
  onSearchChange: (value: string) => void;
}

export function LearnHeader({
  activeTab,
  lessonCount,
  practiceCount,
  search,
  onTabChange,
  onSearchChange,
}: LearnHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="font-serif text-[30px] text-gray-900">Learning Library</h1>
        </div>

        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-4 text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex gap-8">
        <button
          onClick={() => onTabChange("lessons")}
          className={cn(
            "pb-3 text-[14px] font-semibold transition-colors",
            activeTab === "lessons"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Lessons {lessonCount != null ? `(${lessonCount})` : ""}
        </button>
        <button
          onClick={() => onTabChange("practice")}
          className={cn(
            "pb-3 text-[14px] font-semibold transition-colors",
            activeTab === "practice"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Practice Sessions {practiceCount != null ? `(${practiceCount})` : ""}
        </button>
      </div>
    </div>
  );
}
