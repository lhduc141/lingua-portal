"use client";

import { useState } from "react";
import { BookmarkPlus, Check, Volume2 } from "lucide-react";
import { cn } from "@/lib";
import { useSaveVocabulary } from "@/hooks/dictionary";
import type { DictEntryLookupDto } from "@/types/dto/dictionary";

const CEFR_COLORS: Record<string, string> = {
  A1: "bg-gray-100 text-gray-600",
  A2: "bg-green-50 text-green-700",
  B1: "bg-teal-50 text-teal-700",
  B2: "bg-blue-50 text-blue-700",
  C1: "bg-purple-50 text-purple-700",
};

interface WordDetailCardProps {
  entry: DictEntryLookupDto;
  isSaved?: boolean; // ← THÊM
}

export function WordDetailCard({ entry, isSaved = false }: WordDetailCardProps) {
  const saveMutation = useSaveVocabulary();
  const [savedLocal, setSavedLocal] = useState(false);

  // Từ được coi là đã lưu nếu: server trả về isSaved=true HOẶC vừa save trong session
  const isWordSaved = isSaved || savedLocal;

  const handleSave = () => {
    if (isWordSaved) return;
    saveMutation.mutate(
      { entryId: entry.entryId },
      {
        onSuccess: () => setSavedLocal(true),
        onError: (err: any) => {
          if (err?.response?.status === 400) setSavedLocal(true);
        },
      }
    );
  };

  // ── Web Speech API pronunciation ──────────────────────
  const handleSpeak = () => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    synth.cancel(); // dừng nếu đang đọc
    const utterance = new SpeechSynthesisUtterance(entry.headword);
    utterance.lang = "en-US";
    utterance.rate = 0.85; // hơi chậm để rõ hơn
    utterance.pitch = 1;
    // Chọn giọng en-US nếu có
    const voices = synth.getVoices();
    const enVoice = voices.find((v) => v.lang === "en-US") ?? voices[0];
    if (enVoice) utterance.voice = enVoice;
    synth.speak(utterance);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-[36px] font-bold leading-none text-gray-900">
              {entry.headword}
            </h2>
            {entry.ipa && <span className="font-mono text-[15px] text-slate-400">{entry.ipa}</span>}
            {/* Speaker button */}
            <button
              onClick={handleSpeak}
              title="Pronounce"
              className="rounded-full p-1.5 text-slate-400 transition-all hover:bg-teal-50 hover:text-teal-600"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {entry.cefrLevel && (
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[11px] font-bold",
                  CEFR_COLORS[entry.cefrLevel] ?? "bg-gray-100 text-gray-600"
                )}
              >
                {entry.cefrLevel}
              </span>
            )}
            {entry.pos && (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {entry.pos}
              </span>
            )}
            {entry.searchedAs && (
              <span className="text-[12px] text-slate-400">
                (searched as: <em>{entry.searchedAs}</em>)
              </span>
            )}
          </div>
        </div>

        {/* Save button — đổi UI theo trạng thái */}
        <button
          onClick={handleSave}
          disabled={isWordSaved || saveMutation.isPending}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all",
            isWordSaved
              ? "cursor-default border border-teal-300 bg-teal-50 text-teal-600"
              : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
          )}
        >
          {isWordSaved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          {isWordSaved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Word forms */}
      {entry.wordForms.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.wordForms.map((wf, i) => (
            <span
              key={i}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-[12px] text-slate-600"
            >
              {wf.form} <span className="italic text-slate-400">({wf.pos})</span>
            </span>
          ))}
        </div>
      )}

      {/* Senses */}
      <div className="mt-5 space-y-6">
        {entry.senses.map((sense, si) => (
          <div key={sense.senseId}>
            {entry.senses.length > 1 && (
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Meaning {si + 1}
              </p>
            )}
            <p className="text-[15px] leading-relaxed text-gray-800">{sense.shortDef}</p>
            {sense.viDef && (
              <p className="mt-0.5 text-[13px] font-medium text-teal-600">{sense.viDef}</p>
            )}
            {(sense.synonyms.length > 0 || sense.antonyms.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-5 text-[12px]">
                {sense.synonyms.length > 0 && (
                  <p>
                    <span className="font-semibold text-slate-500">Synonyms: </span>
                    <span className="text-slate-600">{sense.synonyms.join(", ")}</span>
                  </p>
                )}
                {sense.antonyms.length > 0 && (
                  <p>
                    <span className="font-semibold text-slate-500">Antonyms: </span>
                    <span className="text-slate-600">{sense.antonyms.join(", ")}</span>
                  </p>
                )}
              </div>
            )}
            {sense.examples.length > 0 && (
              <div className="mt-3 space-y-2">
                {sense.examples.map((ex, ei) => (
                  <div key={ei} className="rounded-lg bg-gray-50 px-4 py-2.5">
                    <p className="text-[13px] italic text-gray-700">&ldquo;{ex.example}&rdquo;</p>
                    {ex.translation && (
                      <p className="mt-0.5 text-[12px] italic text-teal-600">{ex.translation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {sense.collocations.length > 0 && (
              <div className="mt-4">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Collocations
                </p>
                <div className="space-y-3">
                  {sense.collocations.map((col) => (
                    <div key={col.collocationId}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[14px] font-semibold text-gray-900">
                          {col.phrase}
                        </span>
                        <span className="text-slate-400">—</span>
                        <span className="text-[13px] text-slate-500">{col.meaning}</span>
                        {col.viMeaning && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-[13px] font-medium text-teal-600">
                              {col.viMeaning}
                            </span>
                          </>
                        )}
                      </div>
                      {col.example && (
                        <p className="mt-0.5 text-[12px] italic text-slate-400">
                          &ldquo;{col.example}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
