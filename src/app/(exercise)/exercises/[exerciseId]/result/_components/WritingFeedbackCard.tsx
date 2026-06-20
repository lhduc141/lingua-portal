"use client";

import type { AiFeedbackDto, ParagraphFeedbackItem } from "@/types";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { EssayWithInlineFeedback } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/EssayWithInlineFeedback";
import { CriterionBandRow } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/CriterionBandRow";

const SCORE_CONFIDENCE_BADGE: Record<string, { label: string; className: string }> = {
  high: { label: "High confidence", className: "bg-green-50 text-green-700" },
  medium: { label: "Medium confidence", className: "bg-amber-50 text-amber-700" },
  low: { label: "Low confidence", className: "bg-red-50 text-red-700" },
};

function getScoreConfidenceBadge(confidence: string): { label: string; className: string } {
  return SCORE_CONFIDENCE_BADGE[confidence] ?? SCORE_CONFIDENCE_BADGE["medium"]!;
}

function getSeverityColor(severity: string): string {
  if (severity === "high") return "bg-red-50 border-red-200 text-red-700";
  if (severity === "medium") return "bg-orange-50 border-orange-200 text-orange-700";
  return "bg-yellow-50 border-yellow-200 text-yellow-700";
}

export function WritingFeedbackCard({
  aiFeedback,
  userText,
  stemText,
}: {
  aiFeedback: AiFeedbackDto;
  userText: string;
  stemText: string | null;
}) {
  const confidenceBadge = getScoreConfidenceBadge(aiFeedback.scoreConfidence);
  const corrections = aiFeedback.corrections ?? [];
  const hasCorrections = corrections.length > 0;
  const paragraphFeedback = (aiFeedback.paragraphFeedback ?? []) as ParagraphFeedbackItem[];

  const [showAllCorrections, setShowAllCorrections] = useState(false);
  const visibleCorrections = showAllCorrections ? corrections : corrections.slice(0, 3);

  const nextBandLabel =
    aiFeedback.nextBandTarget != null ? `Band ${aiFeedback.nextBandTarget}` : null;

  return (
    <div className="space-y-6">
      {/* BAND SCORE HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">
            Writing Feedback
          </p>
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

          {/* Essay + inline paragraph feedback */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <p className="text-sm font-semibold text-slate-700">Your Essay</p>
            </div>
            <EssayWithInlineFeedback
              text={userText}
              corrections={corrections}
              paragraphFeedback={paragraphFeedback}
            />
          </div>

          {/* Errors Found */}
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
                        <p className="text-sm font-semibold">{c.corrected}</p>
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

          {/* Corrected Version */}
          {aiFeedback.correctedText && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-600" />
                <p className="text-sm font-semibold text-teal-700">Corrected Version</p>
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
                <CriterionBandRow key={criterion.name ?? idx} criterion={criterion} />
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

          {(aiFeedback.nextLevelGaps ?? []).length > 0 && (
            <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-700">
                  Next Level Gaps
                  {nextBandLabel && (
                    <span className="ml-1 font-normal text-purple-500">(To {nextBandLabel})</span>
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
                <p className="text-sm font-semibold text-teal-700">Nhận xét tổng thể</p>
              </div>
              <p className="text-xs text-teal-600">{aiFeedback.scoreRationale}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
