"use client";

import { useState } from "react";
import { BookMarked, Search } from "lucide-react";
import { cn } from "@/lib";
import { useVocabularyList } from "@/hooks/dictionary";
import { PawSpinner } from "@/components";
import type { VocabularyItemDto } from "@/types/dto/dictionary";
import { VocabCard } from "@/app/(main)/vocabulary/_components/VocabCard";

const CEFR_LEVELS = ["All", "A1", "A2", "B1", "B2", "C1"] as const;
const CEFR_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-violet-100 text-violet-700",
  C1: "bg-orange-100 text-orange-700",
};

export default function VocabularyPage() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [pageIndex, setPageIndex] = useState(1);
  const PAGE_SIZE = 20;

  const { data, isLoading } = useVocabularyList({ pageIndex, pageSize: PAGE_SIZE });

  const rows = (data?.data?.rows ?? []) as VocabularyItemDto[];
  const total = data?.data?.count ?? 0;

  // Client-side filter
  const filtered = rows.filter((item) => {
    const matchLevel = selectedLevel === "All" || item.entry.cefrLevel === selectedLevel;
    const matchSearch = !search || item.entry.headword.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  if (isLoading) return <PawSpinner fullScreen />;

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="font-serif text-[32px] text-gray-900">My Vocabulary</h1>
          <p className="mt-1 text-[14px] text-slate-500">Words you&apos;ve saved while learning</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "TOTAL WORDS",
              value: `${total} words`,
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              label: "THIS PAGE",
              value: `${filtered.length} shown`,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "LEVELS",
              value: selectedLevel === "All" ? "All levels" : selectedLevel,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", s.bg)}>
                <BookMarked className={cn("h-5 w-5", s.color)} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {s.label}
                </p>
                <p className={cn("font-serif text-[20px] font-bold", s.color)}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved words..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-[14px] outline-none focus:border-teal-400"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {CEFR_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  "rounded-md px-3 py-1 text-[13px] font-medium transition-all",
                  selectedLevel === level
                    ? "bg-teal-600 text-white"
                    : "text-slate-500 hover:bg-gray-50"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">
            <BookMarked className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-[14px] font-medium text-slate-500">No words saved yet</p>
            <p className="mt-1 text-[13px] text-slate-400">
              Save words from the Dictionary while learning
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <VocabCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[13px] text-slate-500">
              Page {pageIndex} / {Math.ceil(total / PAGE_SIZE)}
            </span>
            <button
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={pageIndex >= Math.ceil(total / PAGE_SIZE)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="w-[280px] shrink-0">
        <div className="sticky top-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-serif text-[16px] text-gray-900">Word List</h3>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {rows.slice(0, 20).map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-gray-900">
                    {item.entry.headword}
                  </span>
                  {item.entry.cefrLevel && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[9px] font-bold",
                        CEFR_COLORS[item.entry.cefrLevel] ?? "bg-gray-100 text-gray-600"
                      )}
                    >
                      {item.entry.cefrLevel}
                    </span>
                  )}
                </div>
                {item.entry.ipa && (
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400">{item.entry.ipa}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
