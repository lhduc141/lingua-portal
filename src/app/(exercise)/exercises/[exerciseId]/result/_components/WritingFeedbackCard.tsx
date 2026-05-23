import type { AiFeedbackDto, CorrectionItem, CriterionBandItem, SubCriterionItem } from "@/types";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

type AnnotatedSegment = {
  text: string;
  correction?: CorrectionItem;
};

export function WritingFeedbackCard({
                                      aiFeedback,
                                      userText,
                                      stemText,
                                    }: {
  aiFeedback: AiFeedbackDto;
  userText: string;
  stemText: string | null;
}) {
  const SCORE_CONFIDENCE_BADGE: Record<string, { label: string; className: string }> = {
    high:   { label: "High confidence",   className: "bg-green-50 text-green-700" },
    medium: { label: "Medium confidence", className: "bg-amber-50 text-amber-700" },
    low:    { label: "Low confidence",    className: "bg-red-50 text-red-700" },
  };

  const confidenceBadge    = getScoreConfidenceBadge(aiFeedback.scoreConfidence);
  const corrections        = aiFeedback.corrections ?? [];
  const hasCorrections     = corrections.length > 0;
  const [showAllCorrections, setShowAllCorrections] = useState(false);
  const visibleCorrections = showAllCorrections ? corrections : corrections.slice(0, 3);

  const nextBandLabel = aiFeedback.nextBandTarget != null
    ? `Band ${aiFeedback.nextBandTarget}`
    : null;

  function AnnotatedEssay({ text, corrections }: { text: string; corrections: CorrectionItem[] }) {
    const segments = buildAnnotatedSegments(text, corrections);
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {segments.map((seg, idx) =>
          seg.correction ? (
            <span key={idx} className="group relative inline">
              <span className="text-red-500 line-through">{seg.correction.original}</span>
              <span className="ml-1 font-semibold uppercase text-green-600">
                {seg.correction.corrected}
              </span>
            </span>
          ) : (
            <span key={idx}>{seg.text}</span>
          )
        )}
      </p>
    );
  }

  function buildAnnotatedSegments(text: string, corrections: CorrectionItem[]): AnnotatedSegment[] {
    const segments: AnnotatedSegment[] = [];
    let processed = 0;

    const placed: { start: number; end: number }[] = [];
    const validCorrections = corrections
      .filter((c) => c.original && text.includes(c.original))
      .sort((a, b) => text.indexOf(a.original) - text.indexOf(b.original))
      .filter((c) => {
        const start    = text.indexOf(c.original);
        const end      = start + c.original.length;
        const overlaps = placed.some((p) => start < p.end && end > p.start);
        if (!overlaps) {
          placed.push({ start, end });
          return true;
        }
        return false;
      });

    for (const correction of validCorrections) {
      const idx = text.indexOf(correction.original, processed);
      if (idx === -1 || idx < processed) continue;
      if (idx > processed) {
        segments.push({ text: text.slice(processed, idx) });
      }
      segments.push({ text: correction.original, correction });
      processed = idx + correction.original.length;
    }
    if (processed < text.length) {
      segments.push({ text: text.slice(processed) });
    }
    return segments;
  }

  function getScoreConfidenceBadge(confidence: string): { label: string; className: string } {
    return SCORE_CONFIDENCE_BADGE[confidence] ?? SCORE_CONFIDENCE_BADGE["medium"]!;
  }

  function getSeverityColor(severity: string): string {
    if (severity === "high")   return "bg-red-50 border-red-200 text-red-700";
    if (severity === "medium") return "bg-orange-50 border-orange-200 text-orange-700";
    return "bg-yellow-50 border-yellow-200 text-yellow-700";
  }

  function getBandColor(band: number | null): string {
    if (band === null) return "text-slate-400";
    if (band >= 7)     return "text-green-600";
    if (band >= 5)     return "text-amber-500";
    return "text-red-500";
  }

  function getBandBarColor(band: number | null): string {
    if (band === null) return "bg-slate-300";
    if (band >= 7)     return "bg-green-500";
    if (band >= 5)     return "bg-amber-500";
    return "bg-red-500";
  }

  function SubCriteriaList({ subCriteria }: { subCriteria: SubCriterionItem[] }) {
    return (
      <div className="mt-3 space-y-3 border-t pt-3">
        {subCriteria.map((sub, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">{sub.name}</span>
              <span className={`text-xs font-semibold ${getBandColor(sub.score)}`}>
                {sub.score.toFixed(1)}/10
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  sub.score >= 7 ? "bg-green-500" : sub.score >= 5 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${(sub.score / 10) * 100}%` }}
              />
            </div>
            {(sub.evidence ?? []).length > 0 && (
              <p className="rounded bg-slate-50 px-2 py-1 text-xs italic text-slate-500">
                &quot;{sub.evidence[0]}&quot;
              </p>
            )}
            <p className="text-xs text-slate-500">{sub.diagnosis}</p>
            <p className="text-xs font-medium text-teal-700">→ {sub.howToImprove}</p>
          </div>
        ))}
      </div>
    );
  }

  function CriterionBandRow({ criterion }: { criterion: CriterionBandItem }) {
    const [expanded, setExpanded] = useState(false);
    const band = criterion.bandEstimate;

    return (
      <div className="rounded-lg border border-slate-100 bg-white p-4">
        <button
          className="flex w-full items-start justify-between gap-3 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">{criterion.name}</span>
              <div className="flex items-center gap-2">
                {band !== null && (
                  <span className={`font-mono text-sm font-bold ${getBandColor(band)}`}>
                    {band.toFixed(1)}
                  </span>
                )}
                {expanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </div>
            {expanded && <p className="text-xs text-slate-500">{criterion.summary}</p>}
          </div>
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {(criterion.strengths ?? []).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                  Strengths
                </p>
                {criterion.strengths.map((s, i) => (
                  <p key={i} className="flex gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                    {s}
                  </p>
                ))}
              </div>
            )}
            {(criterion.weaknesses ?? []).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Weaknesses
                </p>
                {criterion.weaknesses.map((w, i) => (
                  <p key={i} className="flex gap-1.5 text-xs text-slate-600">
                    <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                    {w}
                  </p>
                ))}
              </div>
            )}
            {(criterion.subCriteria ?? []).length > 0 && (
              <SubCriteriaList subCriteria={criterion.subCriteria ?? []} />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* BAND SCORE HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">
            Writing Feedback
          </p>

          {/* [FIX] Dung nextBandTarget cho IELTS progression, khong dung targetBand */}
          <div className="flex items-center gap-3">
            {aiFeedback.currentBand && (
              <>
                <span className="rounded bg-slate-100 px-2 py-1 font-mono text-sm font-medium text-slate-700">
                  {aiFeedback.currentBand}
                </span>
                {nextBandLabel && (
                  <>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="rounded bg-purple-50 px-2 py-1 font-mono text-sm font-semibold text-purple-700">
                      {nextBandLabel}
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          {aiFeedback.wordCountStatus && (
            <p className="text-xs text-slate-500">{aiFeedback.wordCountStatus}</p>
          )}
        </div>

        <div className="text-right">
          <p className="font-serif text-4xl font-bold text-slate-800">
            {aiFeedback.estimatedIeltsBand?.toFixed(1) ?? aiFeedback.overallScore.toFixed(1)}
            <span className="text-lg text-slate-400">/9.0</span>
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${confidenceBadge.className}`}
          >
            {confidenceBadge.label}
          </span>
        </div>
      </div>

      {/* 2-COLUMN BODY */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_42%]">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {stemText && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Question
              </p>
              <p className="text-sm text-slate-600">{stemText}</p>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <p className="text-sm font-semibold text-slate-700">Your Essay</p>
            </div>
            <AnnotatedEssay text={userText} corrections={corrections} />
          </div>

          {hasCorrections && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <p className="text-sm font-semibold text-slate-700">Errors Found</p>
                </div>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  {corrections.length} issues
                </span>
              </div>

              <div className="space-y-3">
                {visibleCorrections.map((c, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 ${getSeverityColor(c.severity)}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                        {c.type.replace("_", " ")}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : c.severity === "medium"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.severity}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm line-through opacity-60">{c.original}</p>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                        <p className="text-sm font-semibold uppercase">{c.corrected}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs opacity-70">{c.explanation}</p>
                  </div>
                ))}
              </div>

              {corrections.length > 3 && (
                <button
                  className="mt-2 text-xs font-medium text-purple-600 hover:underline"
                  onClick={() => setShowAllCorrections((v) => !v)}
                >
                  {showAllCorrections ? "Show less" : `Show ${corrections.length - 3} more`}
                </button>
              )}
            </div>
          )}

          {/* [FIX] Dung nextBandLabel thay vi targetBand cho label */}
          {aiFeedback.correctedText && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-600" />
                <p className="text-sm font-semibold text-teal-700">
                  Corrected Version
                  {nextBandLabel && (
                    <span className="ml-1 font-normal text-teal-500">
                        ({nextBandLabel} level)
                    </span>
                  )}
                </p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-teal-800">
                {aiFeedback.correctedText}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <p className="text-sm font-semibold text-slate-700">IELTS Dimensions</p>
            </div>
            <div className="space-y-2">
              {(aiFeedback.criterionBands ?? []).map((criterion, idx) => (
                <CriterionBandRow key={idx} criterion={criterion} />
              ))}
            </div>
          </div>

          {(aiFeedback.priorityFixes ?? []).length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                <p className="text-sm font-semibold text-slate-700">Priority Fixes</p>
              </div>
              <div className="space-y-3">
                {(aiFeedback.priorityFixes ?? []).map((fix, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {fix.priority}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-700">
                        {fix.area}: {fix.problem}
                      </p>
                      <p className="text-xs text-slate-500">{fix.action}</p>
                      <p className="text-xs font-medium text-teal-600">{fix.expectedImpact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [FIX] Dung nextBandLabel thay vi targetBand cho title "To Band X" */}
          {(aiFeedback.nextLevelGaps ?? []).length > 0 && (
            <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-700">
                  Next Level Gaps
                  {nextBandLabel && (
                    <span className="ml-1 font-normal text-purple-500">
                      (To {nextBandLabel})
                    </span>
                  )}
                </p>
              </div>
              <ul className="space-y-2">
                {(aiFeedback.nextLevelGaps ?? []).map((gap, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-purple-700">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiFeedback.scoreRationale && (
            <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-teal-600" />
                <p className="text-sm font-semibold text-teal-700">Suggestions for Review</p>
              </div>
              <p className="text-xs text-teal-600">{aiFeedback.scoreRationale}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}