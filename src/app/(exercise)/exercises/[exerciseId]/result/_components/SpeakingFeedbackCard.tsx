"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, MessageSquare, TrendingUp, Volume2, } from "lucide-react";
import type { AiFeedbackDto, CriterionBandItem, PronunciationScores, } from "@/types/dto/exercise/exercise-result.dto";

interface SpeakingFeedbackCardProps {
  aiFeedback: AiFeedbackDto;
  userText: string;
  stemText?: string | null;
}

// Color per accuracy score range
const accuracyColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-500";
};

const accuracyBg = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-600";
};

const bandColor = (band: number | null) => {
  if (band === null) return "text-gray-400";
  if (band >= 7) return "text-green-600";
  if (band >= 5) return "text-yellow-600";
  return "text-red-500";
};

const confidenceBadge = {
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
    <div className="space-y-6">
      {/* Header: overall band */}
      <div className="flex items-start justify-between">
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

      {/* Criterion bands */}
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

      {/* Pronunciation detail */}
      {pronunciationScores && (
        <PronunciationDetail scores={pronunciationScores} onSpeak={speakText} />
      )}

      {/* Corrections */}
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

      {/* Style improvements */}
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

      {/* Priority fixes */}
      {priorityFixes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-gray-700">Priority Fixes</p>
          <ul className="space-y-2">
            {priorityFixes.map((fix: any, idx: number) => (
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

      {/* Next level gaps */}
      {nextLevelGaps.length > 0 && (
        <div className="space-y-2">
          <p className="text-[13px] font-semibold text-purple-600">
            Next Level Gaps {nextBandLabel ? `(To ${nextBandLabel})` : ""}
          </p>
          <ul className="space-y-1">
            {nextLevelGaps.map((gap, idx) => (
              <li key={idx} className="flex gap-2 text-[13px] text-gray-600">
                <span className="text-purple-400">•</span>
                <span>{typeof gap === "string" ? gap : ((gap as any)?.gap ?? "")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrected transcript */}
      {correctedText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-gray-700">
              Corrected Version
              {nextBandLabel && (
                <span className="ml-2 text-[12px] font-normal text-gray-400">
                  ({nextBandLabel} level)
                </span>
              )}
            </p>
            <button
              onClick={() => speakText(correctedText, 0.8)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Listen
            </button>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p
              className={`text-[13px] leading-relaxed text-gray-700 ${
                showFullTranscript ? "" : "line-clamp-4"
              }`}
            >
              {correctedText}
            </p>
            {correctedText.length > 300 && (
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
        </div>
      )}

      {/* Original transcript */}
      {userText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-gray-500">Your Transcript</p>
            <button
              onClick={() => speakText(userText)}
              className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-teal-600"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Listen
            </button>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-4">
            <p className="text-[13px] leading-relaxed text-gray-600">{userText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Criterion row with expand/collapse
interface CriterionRowProps {
  criterion: CriterionBandItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function CriterionRow({ criterion, isExpanded, onToggle }: CriterionRowProps) {
  const isPronunciation = criterion.name === "Pronunciation";

  return (
    <div className="rounded-lg border border-gray-100 bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-gray-800">{criterion.name}</span>
          {isPronunciation && (
            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">
              Azure
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[18px] font-bold ${bandColor(criterion.bandEstimate)}`}>
            {criterion.bandEstimate !== null && criterion.bandEstimate !== undefined
              ? criterion.bandEstimate.toFixed(1)
              : criterion.name === "Pronunciation"
                ? "N/A"
                : "—"}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <p className="mb-3 text-[13px] text-gray-600">{criterion.summary}</p>

          {criterion.strengths.length > 0 && (
            <div className="mb-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-600">
                Strengths
              </p>
              <ul className="space-y-1">
                {criterion.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-gray-700">
                    <span className="text-green-500">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {criterion.weaknesses.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-red-500">
                Weaknesses
              </p>
              <ul className="space-y-1">
                {criterion.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-[13px] text-gray-700">
                    <span className="text-red-400">✗</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Pronunciation detail block
interface PronunciationDetailProps {
  scores: PronunciationScores;
  onSpeak: (text: string, rate?: number) => void;
}

function PronunciationDetail({ scores, onSpeak }: PronunciationDetailProps) {
  const problemWords = scores.words.filter(
    (w) => w.errorType && w.errorType !== "None" && w.accuracyScore < 70
  );

  return (
    <div className="space-y-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-orange-600" />
        <p className="text-[13px] font-semibold text-orange-700">Pronunciation Detail</p>
        <span className="rounded bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700">
          Azure Speech
        </span>
      </div>

      {/* Score bars */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreBar label="Accuracy" value={scores.accuracyScore} />
        <ScoreBar label="Fluency" value={scores.fluencyScore} />
        <ScoreBar label="Completeness" value={scores.completenessScore} />
      </div>

      {/* Problem words */}
      {problemWords.length > 0 && (
        <div className="space-y-2">
          <p className="text-[12px] font-semibold text-orange-700">Words to practise:</p>
          <div className="flex flex-wrap gap-2">
            {problemWords.map((word, idx) => (
              <button
                key={word.word + idx}
                onClick={() => onSpeak(word.word, 0.6)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition hover:shadow-sm ${accuracyBg(word.accuracyScore)}`}
              >
                <span className="font-medium">{word.word}</span>
                <Volume2 className="h-3 w-3 opacity-70" />
                <span className="font-mono text-[11px] opacity-80">{word.accuracyScore}%</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-orange-600">
            Click each word to hear the correct pronunciation.
          </p>
        </div>
      )}

      <p className="text-[11px] text-orange-500">
        Estimated IELTS Pronunciation Band:{" "}
        <span className="font-semibold">{scores.estimatedBand.toFixed(1)}</span> — assessed via
        Azure Speech SDK, not official IELTS scoring.
      </p>
    </div>
  );
}

// Small score bar for pronunciation metrics
interface ScoreBarProps {
  label: string;
  value: number;
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-orange-700">{label}</p>
        <p className={`text-[12px] font-semibold ${accuracyColor(value)}`}>{value}%</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-200">
        <div
          className={`h-full rounded-full ${
            value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-400"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
