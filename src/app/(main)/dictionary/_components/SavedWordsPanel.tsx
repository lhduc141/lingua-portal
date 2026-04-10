"use client";

import { BookMarked, Trash2 } from "lucide-react";
import { cn } from "@/lib";
import { useDeleteVocabulary, useVocabularyList } from "@/hooks/dictionary";
import { PawSpinner } from "@/components";
import type { VocabularyItemDto } from "@/types/dto/dictionary";

const CEFR_COLORS: Record<string, string> = {
  A1: "bg-gray-100 text-gray-600",
  A2: "bg-green-50 text-green-700",
  B1: "bg-teal-50 text-teal-700",
  B2: "bg-blue-50 text-blue-700",
  C1: "bg-purple-50 text-purple-700",
};

interface SavedWordCardProps {
  item: VocabularyItemDto;
  isActive: boolean;
  onClick: () => void;
}

function SavedWordCard({ item, isActive, onClick }: SavedWordCardProps) {
  const deleteMutation = useDeleteVocabulary();

  return (
    <div
      className={cn(
        "group flex items-start justify-between rounded-lg border p-3 transition-all",
        isActive
          ? "border-l-[3px] border-b-gray-100 border-l-teal-500 border-r-gray-100 border-t-gray-100 bg-teal-50/50 pl-2.5"
          : "border-gray-100 bg-white hover:border-teal-200 hover:bg-teal-50/30"
      )}
    >
      <button onClick={onClick} className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-gray-900">{item.entry.headword}</span>
          {item.entry.cefrLevel && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-bold",
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
        {item.entry.pos && (
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {item.entry.pos}
          </p>
        )}
        {item.note && (
          <p className="mt-1 line-clamp-1 text-[11px] text-amber-600">📝 {item.note}</p>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteMutation.mutate(item.id);
        }}
        disabled={deleteMutation.isPending}
        className="ml-2 shrink-0 rounded p-1 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-400 disabled:opacity-50 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface SavedWordsPanelProps {
  activeHeadword: string | null;
  onSelectWord: (headword: string) => void;
}

export function SavedWordsPanel({ activeHeadword, onSelectWord }: SavedWordsPanelProps) {
  const { data, isLoading } = useVocabularyList({ pageIndex: 1, pageSize: 50 });
  const rows = (data?.data?.rows ?? []) as VocabularyItemDto[];
  const total = data?.data?.count ?? 0;

  return (
    <div className="sticky top-0 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-teal-600" />
          <h3 className="font-serif text-[16px] text-gray-900">Saved Words</h3>
        </div>
        {total > 0 && (
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-600">
            {total}
          </span>
        )}
      </div>

      {/* List */}
      <div
        className="scrollbar-hide overflow-y-auto p-3"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <PawSpinner size="sm" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <BookMarked className="h-8 w-8 text-slate-200" />
            <p className="mt-3 text-[13px] text-slate-400">
              No saved words yet.
              <br />
              Search a word and tap Save.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((item) => (
              <SavedWordCard
                key={item.id}
                item={item}
                isActive={activeHeadword === item.entry.headword}
                onClick={() => onSelectWord(item.entry.headword)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
