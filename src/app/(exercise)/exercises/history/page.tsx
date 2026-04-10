"use client";

import { useState } from "react";
import { useExerciseHistory } from "@/hooks/exercise";
import { PawSpinner } from "@/components";
import type { ExerciseHistoryItemDto } from "@/types";
import { HistoryFilters, HistoryItem, HistoryStatsBar } from "./_components";

type RefTypeFilter = "all" | "lesson" | "question_set";
type SkillFilter = "all" | "reading" | "writing" | "speaking";

const PAGE_SIZE = 10;

export default function ExerciseHistoryPage() {
  const [refType, setRefType] = useState<RefTypeFilter>("all");
  const [skill, setSkill] = useState<SkillFilter>("all");
  const [pageIndex, setPageIndex] = useState(1);

  const { data, isLoading } = useExerciseHistory({ pageIndex, pageSize: PAGE_SIZE });

  const allRows = (data?.data?.rows ?? []) as ExerciseHistoryItemDto[];
  const total = data?.data?.count ?? 0;

  // Client-side filter
  const filtered = allRows.filter((item) => {
    const matchType = refType === "all" || item.refType === refType;
    const matchSkill = skill === "all" || item.skillName === skill;
    return matchType && matchSkill;
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (isLoading) return <PawSpinner fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-[32px] text-gray-900">Exercise History</h1>
        <p className="mt-1 text-[14px] text-slate-500">Track your learning progress over time</p>
      </div>

      {/* Stats */}
      <HistoryStatsBar items={allRows} />

      {/* Filters */}
      <HistoryFilters
        refType={refType}
        skill={skill}
        onRefTypeChange={(v) => {
          setRefType(v);
          setPageIndex(1);
        }}
        onSkillChange={(v) => {
          setSkill(v);
          setPageIndex(1);
        }}
      />

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">
          <p className="text-[14px] font-medium text-slate-500">No exercises found</p>
          <p className="mt-1 text-[13px] text-slate-400">
            Start a lesson or practice session to see your history here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <HistoryItem key={item.exerciseRecordId} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px]">
          <p className="text-slate-400">
            Showing {(pageIndex - 1) * PAGE_SIZE + 1}–{Math.min(pageIndex * PAGE_SIZE, total)} of{" "}
            {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPageIndex(p)}
                  className={`rounded-lg px-3 py-2 ${
                    pageIndex === p
                      ? "bg-teal-600 text-white"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
              disabled={pageIndex >= totalPages}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}