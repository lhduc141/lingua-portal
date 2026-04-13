"use client";
import { useState } from "react";
import { useAdminPlacementSessions } from "@/hooks/admin";
import { PawSpinner } from "@/components";
import { cn } from "@/lib";
import { PlacementTable } from "./_components";

const PAGE_SIZE = 20;
const CEFR_FILTERS = ["All", "A1", "A2", "B1", "B2", "C1"] as const;

export default function AdminPlacementPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [cefrFilter, setCefrFilter] = useState<string>("All");

  const { data, isLoading } = useAdminPlacementSessions({
    pageIndex,
    pageSize: PAGE_SIZE,
    cefrLevel: cefrFilter === "All" ? undefined : cefrFilter,
    status: "completed",
  });

  const sessions = data?.rows ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (isLoading) return <PawSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[32px] text-gray-900">Placement Results</h1>
        <p className="mt-1 text-[14px] text-slate-500">
          {total} completed sessions — validate CAT engine: questions should stop at 10–20,
          confidence ≥ 70%
        </p>
      </div>

      {/* Filter by CEFR */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-slate-400">Filter:</span>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {CEFR_FILTERS.map((level) => (
            <button
              key={level}
              onClick={() => {
                setCefrFilter(level);
                setPageIndex(1);
              }}
              className={cn(
                "rounded-md px-3 py-1 text-[12px] font-medium transition-all",
                cefrFilter === level ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-gray-50"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <PlacementTable sessions={sessions} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[13px]">
          <p className="text-slate-400">
            Page {pageIndex} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              disabled={pageIndex === 1}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
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
