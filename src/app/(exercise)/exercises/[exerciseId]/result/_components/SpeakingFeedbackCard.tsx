"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, FileText, TrendingUp, Volume2 } from "lucide-react";
import type { AiFeedbackDto, PriorityFixItem } from "@/types/dto/exercise/exercise-result.dto";
import { CriterionRow } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/CriterionRow";
import { PronunciationDetail } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/PronunciationDetail";

interface SpeakingFeedbackCardProps {
  aiFeedback: AiFeedbackDto;
  userText: string;
  stemText?: string | null;
}


const confidenceBadge: Record<string, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-red-100 text-red-600",
};

export function SpeakingFeedbackCard({
  aiFeedback,
  userText,
  stemText,
}: SpeakingFeedbackCardProps) {
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [showFullCorrected, setShowFullCorrected] = useState(false);

  const speakText = (text: string, rate = 0.85) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const {
    estimatedIeltsBand,
    nextBandTarget,
    scoreConfidence,
    criterionBands,
    corrections,
    styleImprovements,
    nextLevelGaps,
    correctedText,
    pronunciationScores,
    priorityFixes,
  } = aiFeedback;

  const nextBandLabel = nextBandTarget ? `Band ${nextBandTarget}` : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_42%]">
      <div className="space-y-4">
        {/* Question */}
        {stemText && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Question
            </p>
            <p className="text-sm text-slate-600">{stemText}</p>
          </div>
        )}

        {/* Your transcript */}
        {userText && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                <p className="text-sm font-semibold text-slate-700">Your Transcript</p>
              </div>
              <button
                onClick={() => speakText(userText)}
                className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-orange-600"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Listen
              </button>
            </div>
            <p
              className={`text-[13px] leading-relaxed text-gray-700 ${
                showFullTranscript ? "" : "line-clamp-6"
              }`}
            >
              {userText}
            </p>
            {userText.length > 400 && (
              <button
                onClick={() => setShowFullTranscript((v) => !v)}
                className="mt-2 flex items-center gap-1 text-[12px] text-teal-600 hover:underline"
              >
                {showFullTranscript ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" /> Show more
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Corrected version */}
        {correctedText && (
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-teal-700">
                Corrected Version
                {nextBandLabel && (
                  <span className="ml-2 text-[12px] font-normal text-teal-500">
                    ({nextBandLabel} level)
                  </span>
                )}
              </p>
              <button
                onClick={() => speakText(correctedText, 0.8)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Listen
              </button>
            </div>
            <p
              className={`text-[13px] leading-relaxed text-teal-800 ${
                showFullCorrected ? "" : "line-clamp-6"
              }`}
            >
              {correctedText}
            </p>
            {correctedText.length > 400 && (
              <button
                onClick={() => setShowFullCorrected((v) => !v)}
                className="mt-2 flex items-center gap-1 text-[12px] text-teal-600 hover:underline"
              >
                {showFullCorrected ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" /> Show more
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between rounded-xl border border-orange-100 bg-orange-50 p-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-orange-600">
              Speaking Feedback
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-[42px] font-bold text-gray-900">
                {estimatedIeltsBand?.toFixed(1) ?? "—"}
              </span>
              <span className="text-[16px] text-gray-400">/9.0</span>
            </div>
            {nextBandLabel && (
              <p className="mt-1 text-[13px] text-gray-500">
                Next target: <span className="font-medium text-orange-600">{nextBandLabel}</span>
              </p>
            )}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-medium capitalize ${
              confidenceBadge[scoreConfidence ?? "medium"]
            }`}
          >
            {scoreConfidence ?? "medium"} confidence
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-gray-700">IELTS Dimensions</p>
          {criterionBands.map((criterion) => (
            <CriterionRow
              key={criterion.name}
              criterion={criterion}
              isExpanded={expandedCriterion === criterion.name}
              onToggle={() =>
                setExpandedCriterion(expandedCriterion === criterion.name ? null : criterion.name)
              }
            />
          ))}
        </div>

        {pronunciationScores && (
          <PronunciationDetail scores={pronunciationScores} onSpeak={speakText} />
        )}

        {corrections.length > 0 && (
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-orange-600">Errors Found</p>
            <ul className="space-y-2">
              {corrections.map((correction, idx) => (
                <li
                  key={correction.original + idx}
                  className="rounded-lg bg-orange-50 p-3 text-[13px]"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 rounded bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-orange-700">
                      {correction.type}
                    </span>
                    <span
                      className={`text-[10px] font-medium capitalize ${
                        correction.severity === "high"
                          ? "text-red-500"
                          : correction.severity === "medium"
                            ? "text-orange-500"
                            : "text-gray-400"
                      }`}
                    >
                      {correction.severity}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="text-red-500 line-through">{correction.original}</span>
                      {" → "}
                      <span className="font-medium text-green-600">{correction.corrected}</span>
                    </p>
                    <p className="text-[12px] text-gray-500">{correction.explanation}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {styleImprovements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <p className="text-[13px] font-semibold text-blue-700">Style Upgrades</p>
              </div>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                optional
              </span>
            </div>
            <ul className="space-y-2">
              {styleImprovements.map((item, idx) => (
                <li
                  key={item.original + idx}
                  className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-[13px]"
                >
                  <div className="flex flex-wrap items-start gap-1.5">
                    <span className="text-gray-400 line-through">{item.original}</span>
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                    <span className="font-medium text-blue-700">{item.improved}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-blue-500">{item.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {priorityFixes.length > 0 && (
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-gray-700">Priority Fixes</p>
            <ul className="space-y-2">
              {priorityFixes.map((fix: PriorityFixItem, idx: number) => (
                <li
                  key={idx}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-[13px]"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-600">
                      {fix.priority}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">
                        {fix.area}: {fix.problem}
                      </p>
                      <p className="mt-0.5 text-gray-500">{fix.action}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextLevelGaps.length > 0 && (
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-purple-600">
              Next Level Gaps {nextBandLabel ? `(To ${nextBandLabel})` : ""}
            </p>
            <ul className="space-y-1">
              {nextLevelGaps.map((gap, idx) => (
                <li key={idx} className="flex gap-2 text-[13px] text-gray-600">
                  <span className="text-purple-400">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
