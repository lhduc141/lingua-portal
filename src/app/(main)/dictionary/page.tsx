"use client";

import { useCallback, useEffect, useState } from "react";
import { useLookupWord, useVocabularyList } from "@/hooks/dictionary";
import { PawSpinner } from "@/components";
import type { DictEntryLookupDto, VocabularyItemDto } from "@/types/dto/dictionary";
import {
  DictionaryEmptyState,
  DictionarySearchBar,
  SavedWordsPanel,
  WordDetailCard,
} from "./_components";

export default function DictionaryPage() {
  const [input, setInput] = useState("");
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<DictEntryLookupDto | null>(null);
  const [isSlowQuery, setIsSlowQuery] = useState(false);

  const { data: vocabData } = useVocabularyList({ pageIndex: 1, pageSize: 100 });
  const savedEntryIds = new Set(
    ((vocabData?.data?.rows ?? []) as VocabularyItemDto[]).map((v) => v.entry.entryId)
  );

  const { data, isLoading, isError } = useLookupWord(searchWord);

  useEffect(() => {
    const entry = data?.data as DictEntryLookupDto | undefined;
    if (!entry) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveEntry(entry);
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSlowQuery(false);
    if (!searchWord) return;
    const timer = setTimeout(() => {
      if (isLoading) setIsSlowQuery(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchWord]);

  const handleSearch = useCallback(() => {
    const word = input.trim().toLowerCase();
    if (!word) return;
    setSearchWord(word);
  }, [input]);

  // Click từ trong saved panel → trigger lookup
  const handleSelectSavedWord = (headword: string) => {
    setInput(headword);
    setSearchWord(headword);
  };

  const handleSuggest = (word: string) => {
    setInput(word);
    setSearchWord(word);
  };

  return (
    <div className="flex gap-6">
      {/* Left: Search + Detail */}
      <div className="min-w-0 flex-1 space-y-5">
        <div>
          <h1 className="font-serif text-[32px] text-gray-900">Dictionary</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Search for any English word to see its definition, examples, and collocations.
          </p>
        </div>

        <DictionarySearchBar value={input} onChange={setInput} onSearch={handleSearch} />

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <PawSpinner />
            <p className="animate-pulse text-[13px] text-slate-400">
              {isSlowQuery
                ? "🤖 Word not found in database — generating with AI..."
                : "Looking up..."}
            </p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-[14px] font-medium text-red-600">
              Word not found. Try a different spelling or another word.
            </p>
          </div>
        )}

        {!searchWord && !activeEntry && <DictionaryEmptyState onSuggest={handleSuggest} />}

        {activeEntry && !isLoading && (
          <WordDetailCard entry={activeEntry} isSaved={savedEntryIds.has(activeEntry.entryId)} />
        )}
      </div>

      {/* Right: Saved Words */}
      <div className="w-[300px] shrink-0">
        <SavedWordsPanel
          activeHeadword={activeEntry?.headword ?? null}
          onSelectWord={handleSelectSavedWord}
        />
      </div>
    </div>
  );
}
