"use client";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquare,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { CorrectionItem, ExerciseAnswerResultDto, StyleImprovementItem } from "@/types";
import { WritingFeedbackCard } from "@/app/(exercise)/exercises/[exerciseId]/result/_components/WritingFeedbackCard";

interface QuestionResultCardProps {
  answer: ExerciseAnswerResultDto;
  index: number;
}

export function QuestionResultCard({ answer, index }: QuestionResultCardProps) {
  const {
    questionType,
    stemText,
    isCorrect,
    earnedScore,
    maxScore,
    userAnswer,
    correctAnswer,
    aiFeedback,
    gradingStatus,
  } = answer;

  const isPending = gradingStatus !== "scored" && gradingStatus !== "auto_scored";
  const isSubjective =
    questionType === "essay" || questionType === "speaking" || questionType === "dictation";
  const isEssay = questionType === "essay";

  // Essay with feedback → full redesign layout
  if (isEssay && aiFeedback && !isPending) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <WritingFeedbackCard
          aiFeedback={aiFeedback}
          userText={userAnswer?.textAnswer ?? ""}
          stemText={stemText}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {index + 1}
          </span>
          <div>
            <p className="font-medium">Question {index + 1}</p>
            <p className="text-sm capitalize text-muted-foreground">
              {(questionType || "unknown").replace(/_/g, " ")}
            </p>
          </div>
        </div>
        {isPending ? (
          <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Grading…</span>
          </div>
        ) : isSubjective ? (
          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Graded</span>
          </div>
        ) : isCorrect ? (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Correct</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-red-700">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Incorrect</span>
          </div>
        )}
      </div>

      {/* Stem Text */}
      {stemText && (
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-gray-700">{stemText}</p>
        </div>
      )}

      {/* Score */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Score:</span>
        <span className="font-semibold">
          {earnedScore !== null && earnedScore !== undefined
            ? isSubjective
              ? `${(earnedScore * 10).toFixed(1)}/10`
              : `${earnedScore.toFixed(1)}/${maxScore}`
            : "—"}
        </span>
      </div>

      {/* User Answer */}
      {userAnswer && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Your answer:</p>
          {userAnswer.textAnswer && (
            <div className="rounded-lg bg-muted p-3">
              <p className="whitespace-pre-wrap text-sm">{userAnswer.textAnswer}</p>
            </div>
          )}
          {userAnswer.optionIds && userAnswer.optionIds.length > 0 && (
            <div className="space-y-1">
              {(userAnswer.optionTexts ?? userAnswer.optionIds).map((text: string, idx: number) => (
                <div
                  key={`opt-${idx}`}
                  className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Correct Answer */}
      {!isSubjective && correctAnswer && !isPending && !isCorrect && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-600">Correct answer:</p>
          {correctAnswer.textAnswers && correctAnswer.textAnswers.length > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">{correctAnswer.textAnswers.join(" / ")}</p>
            </div>
          )}
          {correctAnswer.optionIds && correctAnswer.optionIds.length > 0 && (
            <div className="space-y-1">
              {(correctAnswer.optionTexts ?? correctAnswer.optionIds).map(
                (text: string, idx: number) => (
                  <div
                    key={`correct-${idx}`}
                    className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{text}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* AI Feedback — speaking/dictation simple view */}
      {aiFeedback && !isPending && (
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquare className="h-4 w-4" />
            <p className="text-sm font-medium">AI Feedback</p>
          </div>

          {aiFeedback.overallScore !== null && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Overall score:</span>
              <span className="text-sm font-semibold">{aiFeedback.overallScore.toFixed(1)}/10</span>
            </div>
          )}

          {(aiFeedback.criterionBands ?? []).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Detailed evaluation:</p>
              {(aiFeedback.criterionBands ?? []).map((criterion, idx) => (
                <div key={idx} className="space-y-1 rounded-lg bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{criterion.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {criterion.internalScore.toFixed(1)}/10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{criterion.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* Genuine errors */}
          {(aiFeedback.corrections ?? []).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-600">Errors to fix:</p>
              <ul className="space-y-2">
                {(aiFeedback.corrections ?? []).map((correction: CorrectionItem, idx: number) => (
                  <li key={idx} className="rounded-lg bg-orange-50 p-3 text-sm">
                    <div className="space-y-1">
                      <p>
                        <span className="text-orange-600 line-through">{correction.original}</span>
                        {" → "}
                        <span className="font-medium text-green-600">{correction.corrected}</span>
                      </p>
                      <p className="text-xs text-orange-500">{correction.explanation}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Style improvements */}
          {(aiFeedback.styleImprovements ?? []).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-medium text-blue-700">Style Upgrades</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                  optional
                </span>
              </div>
              <ul className="space-y-2">
                {(aiFeedback.styleImprovements ?? []).map(
                  (item: StyleImprovementItem, idx: number) => (
                    <li
                      key={idx}
                      className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-start gap-1.5">
                        <span className="text-slate-400 line-through">{item.original}</span>
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                        <span className="font-medium text-blue-700">{item.improved}</span>
                      </div>
                      <p className="mt-1 text-xs text-blue-500">{item.explanation}</p>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {(aiFeedback.nextLevelGaps ?? []).length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-purple-600">Next level gaps:</p>
              <ul className="space-y-1">
                {(aiFeedback.nextLevelGaps ?? []).map((gap: any, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-purple-600">•</span>
                    <span>{typeof gap === "string" ? gap : (gap?.gap ?? gap?.text ?? "")}</span>
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
