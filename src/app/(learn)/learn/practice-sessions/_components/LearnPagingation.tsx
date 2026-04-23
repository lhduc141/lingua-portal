"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib";

interface LearnPaginationProps {
  pageIndex: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function LearnPagination({
  pageIndex,
  totalCount,
  pageSize,
  onPageChange,
}: LearnPaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={pageIndex === 1}
        className="flex items-center gap-1 px-3 py-2 text-[14px] font-semibold text-slate-500 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-[14px] font-bold",
            page === pageIndex
              ? "bg-teal-600 text-white shadow-sm"
              : "border border-gray-200 bg-white text-slate-500 hover:bg-gray-50"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={pageIndex === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-[14px] font-semibold text-slate-500 disabled:opacity-40"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
