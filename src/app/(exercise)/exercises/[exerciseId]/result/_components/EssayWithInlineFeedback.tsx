"use client";

import { useState } from "react";
import type {
  CorrectionItem,
  LegacyParagraphFeedbackItem,
  NewParagraphFeedbackItem,
  ParagraphFeedbackItem,
} from "@/types";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const MAX_CORRECTION_SPAN = 80;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAnnotatedSegments(
  paraText: string,
  corrections: CorrectionItem[]
): { text: string; correction?: CorrectionItem }[] {
  const segments: { text: string; correction?: CorrectionItem }[] = [];
  let processed = 0;

  const placed: { start: number; end: number }[] = [];

  const validCorrections = corrections
    .filter((c) => {
      if (!c.original || c.original.length === 0) return false;
      // Guard 1: long span
      if (c.original.length > MAX_CORRECTION_SPAN) return false;
      // Guard 2: phrase must exist in this paragraph
      if (!paraText.includes(c.original)) return false;
      // Guard 3: skip if phrase appears more than once — risk of highlighting wrong occurrence
      const count = (paraText.match(new RegExp(escapeRegex(c.original), "g")) ?? []).length;
      if (count > 1) return false;
      return true;
    })
    .sort((a, b) => paraText.indexOf(a.original) - paraText.indexOf(b.original))
    .filter((c) => {
      const start = paraText.indexOf(c.original);
      const end = start + c.original.length;
      const overlaps = placed.some((p) => start < p.end && end > p.start);
      if (!overlaps) {
        placed.push({ start, end });
        return true;
      }
      return false;
    });

  for (const correction of validCorrections) {
    const idx = paraText.indexOf(correction.original, processed);
    if (idx === -1 || idx < processed) continue;
    if (idx > processed) segments.push({ text: paraText.slice(processed, idx) });
    segments.push({ text: correction.original, correction });
    processed = idx + correction.original.length;
  }
  if (processed < paraText.length) segments.push({ text: paraText.slice(processed) });
  return segments;
}

function inferParagraphType(
  idx: number,
  total: number
): "introduction" | "body_1" | "body_2" | "body_3" | "conclusion" {
  if (idx === 0) return "introduction";
  if (idx === total - 1) return "conclusion";
  const bodyIdx = idx - 1;
  if (bodyIdx === 0) return "body_1";
  if (bodyIdx === 1) return "body_2";
  return "body_3";
}

function isNewFormat(item: ParagraphFeedbackItem): item is NewParagraphFeedbackItem {
  return "taskAchievement" in item;
}

function NewFormatPanel({ item }: { item: NewParagraphFeedbackItem }) {
  const [open, setOpen] = useState(false);

  const hasContent =
    item.taskAchievement || item.coherenceCohesion || item.lexicalResource || item.grammarAccuracy;

  if (!hasContent) return null;

  return (
    <div className="mt-2 rounded-lg border border-purple-100 bg-purple-50/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-xs font-semibold text-purple-700">{item.title || "Feedback"}</span>
        <div className="flex items-center gap-1 text-xs text-purple-400">
          Feedback
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </div>
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-purple-100 px-3 py-3">
          {item.taskAchievement && (
            <p className="text-xs leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-500">1. Task Achievement: </span>
              {item.taskAchievement}
            </p>
          )}
          {item.coherenceCohesion && (
            <p className="text-xs leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-500">2. Coherence & Cohesion: </span>
              {item.coherenceCohesion}
            </p>
          )}
          {item.lexicalResource && (
            <p className="text-xs leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-500">3. Lexical Resource: </span>
              {item.lexicalResource}
            </p>
          )}
          {item.grammarAccuracy && (
            <p className="text-xs leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-500">
                4. Grammatical Range & Accuracy:{" "}
              </span>
              {item.grammarAccuracy}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function LegacyFormatPanel({ item }: { item: LegacyParagraphFeedbackItem }) {
  const [open, setOpen] = useState(false);

  const hasContent =
    item.feedback || (item.strengths ?? []).length > 0 || (item.improvements ?? []).length > 0;

  if (!hasContent) return null;

  return (
    <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-xs font-semibold text-slate-500">Feedback</span>
        {open ? (
          <ChevronUp className="h-3 w-3 text-slate-400" />
        ) : (
          <ChevronDown className="h-3 w-3 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="space-y-2 border-t border-slate-100 px-3 py-3">
          {item.feedback && (
            <p className="text-xs leading-relaxed text-slate-600">{item.feedback}</p>
          )}
          {(item.strengths ?? []).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                Strengths
              </p>
              {item.strengths.map((s, i) => (
                <p key={i} className="flex gap-1.5 text-xs text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                  {s}
                </p>
              ))}
            </div>
          )}
          {(item.improvements ?? []).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                How to improve
              </p>
              {item.improvements.map((imp, i) => (
                <p key={i} className="flex gap-1.5 text-xs text-slate-600">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                  {imp}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ParagraphFeedbackPanel({ item }: { item: ParagraphFeedbackItem }) {
  if (isNewFormat(item)) return <NewFormatPanel item={item} />;
  return <LegacyFormatPanel item={item} />;
}

function splitIntoParagraphs(text: string): string[] {
  const byDouble = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (byDouble.length > 1) return byDouble;
  return text
    .split(/\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function EssayWithInlineFeedback({
  text,
  corrections,
  paragraphFeedback = [],
}: {
  text: string;
  corrections: CorrectionItem[];
  paragraphFeedback?: ParagraphFeedbackItem[];
}) {
  const paragraphs = splitIntoParagraphs(text);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        const paraCorrections = corrections.filter((c) => c.original && para.includes(c.original));
        const segments = buildAnnotatedSegments(para, paraCorrections);

        const inferredType = inferParagraphType(idx, paragraphs.length);
        const feedback =
          paragraphFeedback.find((item) => item.type === inferredType) ?? paragraphFeedback[idx];

        return (
          <div key={idx}>
            <p className="text-sm leading-relaxed text-slate-700">
              {segments.map((seg, i) =>
                seg.correction ? (
                  // Chỉ underline lỗi — KHÔNG render corrected inline
                  <span
                    key={i}
                    className="cursor-help border-b-2 border-red-400 text-red-600"
                    title={`→ ${seg.correction.corrected}`}
                  >
                    {seg.correction.original}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </p>

            {feedback && <ParagraphFeedbackPanel item={feedback} />}
          </div>
        );
      })}
    </div>
  );
}
