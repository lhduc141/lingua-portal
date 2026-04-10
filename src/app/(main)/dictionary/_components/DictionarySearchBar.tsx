"use client";

import { Search } from "lucide-react";

interface DictionarySearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}

export function DictionarySearchBar({ value, onChange, onSearch }: DictionarySearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search for a word..."
          className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-[15px] shadow-sm outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
      </div>
      <button
        onClick={onSearch}
        className="h-12 rounded-xl bg-teal-600 px-7 text-[14px] font-bold text-white transition-colors hover:bg-teal-700"
      >
        Search
      </button>
    </div>
  );
}
