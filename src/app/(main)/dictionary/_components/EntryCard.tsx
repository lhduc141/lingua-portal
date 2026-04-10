import { cn } from "@/lib";
import { DictEntryLookupDto } from "@/types";
import { useSaveVocabulary } from "@/hooks";
import { useState } from "react";
import { BookmarkPlus, Check, Volume2 } from "lucide-react";

const CEFR_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-violet-100 text-violet-700",
  C1: "bg-orange-100 text-orange-700",
};

export function EntryCard({ entry }: { entry: DictEntryLookupDto }) {
  const saveMutation = useSaveVocabulary();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveMutation.mutate({ entryId: entry.entryId }, { onSuccess: () => setSaved(true) });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-[32px] text-gray-900">{entry.headword}</h2>
            {entry.ipa && <span className="font-mono text-[16px] text-slate-500">{entry.ipa}</span>}
            <button className="text-slate-400 hover:text-teal-600">
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
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
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-gray-500">
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

        <button
          onClick={handleSave}
          disabled={saved || saveMutation.isPending}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all",
            saved
              ? "bg-teal-50 text-teal-600"
              : "bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
          )}
        >
          {saved ? <Check className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Word Forms */}
      {entry.wordForms.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.wordForms.map((wf, i) => (
            <span
              key={i}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-[12px] text-slate-600"
            >
              {wf.form} <span className="text-slate-400">({wf.pos})</span>
            </span>
          ))}
        </div>
      )}

      {/* Senses */}
      <div className="mt-5 space-y-5">
        {entry.senses.map((sense, si) => (
          <div key={sense.senseId} className="border-l-2 border-teal-200 pl-4">
            {entry.senses.length > 1 && (
              <span className="mb-1 inline-block text-[11px] font-bold text-slate-400">
                MEANING {si + 1}
              </span>
            )}
            <p className="text-[15px] text-gray-900">{sense.shortDef}</p>
            {sense.viDef && <p className="mt-0.5 text-[13px] text-teal-700">{sense.viDef}</p>}

            {(sense.synonyms.length > 0 || sense.antonyms.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-4 text-[12px]">
                {sense.synonyms.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500">Synonyms: </span>
                    <span className="text-slate-600">{sense.synonyms.join(", ")}</span>
                  </div>
                )}
                {sense.antonyms.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500">Antonyms: </span>
                    <span className="text-slate-600">{sense.antonyms.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {sense.examples.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {sense.examples.map((ex, ei) => (
                  <div key={ei} className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-[13px] italic text-gray-700">&#34;{ex.example}&#34;</p>
                    {ex.translation && (
                      <p className="mt-0.5 text-[12px] text-slate-500">{ex.translation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {sense.collocations.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Collocations
                </p>
                <div className="space-y-2">
                  {sense.collocations.map((col) => (
                    <div
                      key={col.collocationId}
                      className="rounded-lg border border-gray-100 bg-white px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-gray-900">
                          {col.phrase}
                        </span>
                        <span className="text-[12px] text-slate-500">— {col.meaning}</span>
                      </div>
                      {col.viMeaning && (
                        <p className="text-[12px] text-teal-600">{col.viMeaning}</p>
                      )}
                      {col.example && (
                        <p className="mt-1 text-[12px] italic text-slate-500">&#34;{col.example}&#34;</p>
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