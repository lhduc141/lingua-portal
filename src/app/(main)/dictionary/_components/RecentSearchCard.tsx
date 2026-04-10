"use client";

import { cn } from "@/lib";
import type { DictEntryLookupDto } from "@/types/dto/dictionary";

const CEFR_COLORS: Record<string, string> = {
  A1: "bg-gray-100 text-gray-600",
  A2: "bg-green-50 text-green-700",
  B1: "bg-teal-50 text-teal-700",
  B2: "bg-blue-50 text-blue-700",
  C1: "bg-purple-50 text-purple-700",
};

interface RecentSearchCardProps {
  entry: DictEntryLookupDto;
  isActive: boolean;
  onClick: () => void;
}

export function RecentSearchCard({ entry, isActive, onClick }: RecentSearchCardProps) {
  const firstSense = entry.senses[0];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-all hover:border-teal-200 hover:bg-teal-50/40",
        isActive
          ? "border-l-[3px] border-b-gray-100 border-l-teal-500 border-r-gray-100 border-t-gray-100 bg-teal-50/50 pl-2.5"
          : "border-gray-100 bg-white"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-semibold text-gray-900">{entry.headword}</span>
        {entry.cefrLevel && (
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold",
              CEFR_COLORS[entry.cefrLevel] ?? "bg-gray-100 text-gray-600"
            )}
          >
            {entry.cefrLevel}
          </span>
        )}
      </div>
      {entry.ipa && <p className="mt-0.5 font-mono text-[11px] text-slate-400">{entry.ipa}</p>}
      {firstSense && (
        <>
          <p className="mt-1 line-clamp-1 text-[12px] text-gray-600">{firstSense.shortDef}</p>
          {firstSense.viDef && (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-teal-600">{firstSense.viDef}</p>
          )}
        </>
      )}
    </button>
  );
}
