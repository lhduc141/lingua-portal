import type { ParagraphFeedbackItem } from "@/types";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const PARAGRAPH_TYPE_LABEL: Record<string, string> = {
  introduction: "Introduction",
  body_1: "Body Paragraph 1",
  body_2: "Body Paragraph 2",
  body_3: "Body Paragraph 3",
  conclusion: "Conclusion",
};

export function ParagraphFeedbackRow({ item }: { item: ParagraphFeedbackItem }) {
  const [expanded, setExpanded] = useState(false);
  const label = PARAGRAPH_TYPE_LABEL[item.type] ?? item.type;

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4">
      <button
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          {!expanded && item.openingSentence && (
            <p className="mt-1 truncate text-xs italic text-slate-400">
              &quot;{item.openingSentence}&quot;
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {item.openingSentence && (
            <p className="rounded bg-slate-50 px-3 py-2 text-xs italic text-slate-500">
              &quot;{item.openingSentence}&quot;
            </p>
          )}

          {/*{item.feedback && (*/}
          {/*  <p className="text-xs leading-relaxed text-slate-600">{item.feedback}</p>*/}
          {/*)}*/}

          {/*{(item.strengths ?? []).length > 0 && (*/}
          {/*  <div className="space-y-1">*/}
          {/*    <p className="text-xs font-semibold uppercase tracking-wider text-green-600">*/}
          {/*      Strengths*/}
          {/*    </p>*/}
          {/*    {item.strengths.map((s, i) => (*/}
          {/*      <p key={i} className="flex gap-1.5 text-xs text-slate-600">*/}
          {/*        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />*/}
          {/*        {s}*/}
          {/*      </p>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}

          {/*{(item.improvements ?? []).length > 0 && (*/}
          {/*  <div className="space-y-1">*/}
          {/*    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">*/}
          {/*      How to improve*/}
          {/*    </p>*/}
          {/*    {item.improvements.map((imp, i) => (*/}
          {/*      <p key={i} className="flex gap-1.5 text-xs text-slate-600">*/}
          {/*        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />*/}
          {/*        {imp}*/}
          {/*      </p>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      )}
    </div>
  );
}
