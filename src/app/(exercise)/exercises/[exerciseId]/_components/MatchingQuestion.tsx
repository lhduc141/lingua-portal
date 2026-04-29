"use client";

import { useMemo } from "react";
import { cn } from "@/lib";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface MatchingPair {
  left: string;
  right: string;
}

interface MatchingConfig {
  pairs: MatchingPair[];
  leftLabels: string[];
  rightLabels: string[];
}

interface MatchingQuestionProps {
  question: AssessmentQuestionDto;
  /** JSON string: { "left_label": "selected_right", ... } */
  textAnswer: string;
  onAnswerChange: (json: string) => void;
}

export function MatchingQuestion({ question, textAnswer, onAnswerChange }: MatchingQuestionProps) {
  // Parse config (pairs + labels) from contentJson
  const config = useMemo<MatchingConfig | null>(() => {
    if (!question.contentJson) return null;
    try {
      const parsed = question.contentJson as MatchingConfig;
      if (!Array.isArray(parsed.pairs)) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [question.contentJson]);

  // Parse current selections
  const selections = useMemo<Record<string, string>>(() => {
    if (!textAnswer) return {};
    try {
      return JSON.parse(textAnswer) as Record<string, string>;
    } catch {
      return {};
    }
  }, [textAnswer]);

  const handleSelect = (leftLabel: string, rightValue: string) => {
    const updated = { ...selections, [leftLabel]: rightValue };
    onAnswerChange(JSON.stringify(updated));
  };

  // Fallback if configJson not available
  if (!config || config.pairs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-8">
        <p className="text-body-m text-gray-500">{question.stemText ?? "Match the items below."}</p>
        <p className="mt-4 text-[13px] text-red-400">
          Configuration not available. Please refresh.
        </p>
      </div>
    );
  }

  const rightOptions =
    config.rightLabels.length > 0 ? config.rightLabels : config.pairs.map((p) => p.right);

  // Shuffle right options for display (stable shuffle based on questionId)
  const shuffledRight = useMemo(() => {
    const arr = [...rightOptions];
    // Deterministic shuffle using questionId as seed — same every render
    const seed = question.questionId.charCodeAt(0) + question.questionId.charCodeAt(1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 1)) % (i + 1);
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }, [rightOptions, question.questionId]);

  const answeredCount = Object.keys(selections).length;
  const totalCount = config.pairs.length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        {/* Question stem */}
        <div className="mb-6">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Matching
          </p>
          <p className="text-body-l text-gray-900">
            {question.stemText ??
              "Match each item on the left with the correct option on the right."}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(answeredCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-[12px] text-gray-500">
            {answeredCount}/{totalCount} matched
          </span>
        </div>

        {/* Matching pairs */}
        <div className="space-y-3">
          {config.pairs.map((pair) => {
            const selected = selections[pair.left];
            const isAnswered = !!selected;

            return (
              <div
                key={pair.left}
                className={cn(
                  "flex items-center gap-4 rounded-xl border-2 p-4 transition-all",
                  isAnswered ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50"
                )}
              >
                {/* Left label */}
                <div className="w-[40%] shrink-0">
                  <span className="text-[14px] font-medium text-gray-800">{pair.left}</span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-gray-300">→</div>

                {/* Right selector */}
                <div className="flex-1">
                  <select
                    value={selected ?? ""}
                    onChange={(e) => handleSelect(pair.left, e.target.value)}
                    className={cn(
                      "w-full rounded-lg border-2 px-3 py-2 text-[14px] transition-colors focus:outline-none",
                      isAnswered
                        ? "border-emerald-400 bg-white text-gray-900 focus:border-emerald-500"
                        : "border-gray-200 bg-white text-gray-500 focus:border-emerald-400"
                    )}
                  >
                    <option value="" disabled>
                      — Select match —
                    </option>
                    {shuffledRight.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="mt-5 text-[12px] text-gray-400">
          Select the correct match for each item on the left.
        </p>
      </div>
    </div>
  );
}
