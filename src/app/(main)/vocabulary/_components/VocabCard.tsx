import { useState } from "react";
import { BookMarked, Check, PenLine, Trash2, X } from "lucide-react";
import { cn } from "@/lib";
import { useDeleteVocabulary, useUpdateVocabularyNote } from "@/hooks/dictionary";
import type { VocabularyItemDto } from "@/types/dto/dictionary";

const CEFR_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-violet-100 text-violet-700",
  C1: "bg-orange-100 text-orange-700",
};

export function VocabCard({ item }: { item: VocabularyItemDto }) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.note ?? "");
  const deleteMutation = useDeleteVocabulary();
  const updateMutation = useUpdateVocabularyNote();

  const handleSaveNote = () => {
    updateMutation.mutate(
      { id: item.id, note: noteText },
      { onSuccess: () => setEditingNote(false) }
    );
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-[20px] text-gray-900">{item.entry.headword}</span>
            {item.entry.ipa && (
              <span className="font-mono text-[13px] text-slate-500">{item.entry.ipa}</span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            {item.entry.cefrLevel && (
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold",
                  CEFR_COLORS[item.entry.cefrLevel] ?? "bg-gray-100 text-gray-600"
                )}
              >
                {item.entry.cefrLevel}
              </span>
            )}
            {item.entry.pos && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                {item.entry.pos}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 text-[12px] text-slate-400">
            <span>Saved: {formatDate(item.addedAt)}</span>
            {item.context && (
              <span className="flex items-center gap-1">
                <BookMarked className="h-3 w-3" />
                {item.context}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingNote(!editingNote)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
              editingNote
                ? "bg-teal-50 text-teal-600"
                : "border border-gray-200 text-slate-500 hover:border-teal-200 hover:text-teal-600"
            )}
          >
            <PenLine className="h-3.5 w-3.5" />
            {item.note ? "Edit Note" : "Note"}
          </button>
          <button
            onClick={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Note display */}
      {item.note && !editingNote && (
        <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
          <p className="text-[12px] text-amber-800">{item.note}</p>
        </div>
      )}

      {/* Note editor */}
      {editingNote && (
        <div className="mt-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note here..."
            rows={2}
            className="w-full rounded-lg border border-gray-200 p-2.5 text-[13px] outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => {
                setEditingNote(false);
                setNoteText(item.note ?? "");
              }}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] text-slate-500 hover:bg-gray-100"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <button
              onClick={handleSaveNote}
              disabled={updateMutation.isPending}
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}