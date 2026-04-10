import { Search } from "lucide-react";

interface DictionaryEmptyStateProps {
  onSuggest: (word: string) => void;
}

const SUGGESTIONS = ["happy", "achieve", "resilient"] as const;

export function DictionaryEmptyState({ onSuggest }: DictionaryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
        <Search className="h-7 w-7 text-teal-400" />
      </div>
      <p className="mt-4 text-[15px] font-medium text-gray-700">Type a word to get started</p>
      <p className="mt-1.5 text-[13px] text-slate-400">
        Try:{" "}
        {SUGGESTIONS.map((w, i) => (
          <span key={w}>
            {i > 0 && ", "}
            <button onClick={() => onSuggest(w)} className="text-teal-600 hover:underline">
              {w}
            </button>
          </span>
        ))}
      </p>
    </div>
  );
}
