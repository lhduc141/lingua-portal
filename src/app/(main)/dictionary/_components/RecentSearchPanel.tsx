"use client";

import { X, Search } from "lucide-react";
import { RecentSearchCard } from "./RecentSearchCard";
import type { DictEntryLookupDto } from "@/types/dto/dictionary";

interface RecentSearchPanelProps {
  searches: DictEntryLookupDto[];
  activeEntryId: string | null;
  onSelect: (entry: DictEntryLookupDto) => void;
  onClear: () => void;
}

export function RecentSearchPanel({
  searches,
  activeEntryId,
  onSelect,
  onClear,
}: RecentSearchPanelProps) {
  return (
    <div className="sticky top-0 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="font-serif text-[16px] text-gray-900">Recent Searches</h3>
        {searches.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[12px] text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div
        className="scrollbar-hide overflow-y-auto p-3"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {searches.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Search className="h-8 w-8 text-slate-200" />
            <p className="mt-3 text-[13px] text-slate-400">
              Your search history
              <br />
              will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {searches.map((entry) => (
              <RecentSearchCard
                key={entry.entryId}
                entry={entry}
                isActive={activeEntryId === entry.entryId}
                onClick={() => onSelect(entry)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
