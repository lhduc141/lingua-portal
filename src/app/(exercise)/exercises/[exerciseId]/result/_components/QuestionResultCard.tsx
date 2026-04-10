"use client";

import { CheckCircle2, Loader2, MessageSquare, XCircle } from "lucide-react";
import type { CorrectionItem, ExerciseAnswerResultDto } from "@/types";

type QuestionResultCardProps = {
  answer: ExerciseAnswerResultDto;
  index: number;
};

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
  const isSubjective = questionType === "essay" || questionType === "speaking";

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {index + 1}
          </span>
          <div>
            <p className="font-medium">Câu hỏi {index + 1}</p>
            <p className="text-sm capitalize text-muted-foreground">
              {(questionType || "unknown").replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Đang chấm điểm...</span>
          </div>
        ) : isCorrect ? (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Đúng</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-red-700">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Sai</span>
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
        <span className="text-muted-foreground">Điểm:</span>
        <span className="font-semibold">
          {earnedScore !== null && earnedScore !== undefined ? earnedScore.toFixed(1) : "..."}/
          {maxScore}
        </span>
      </div>

      {/* User Answer */}
      {userAnswer && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Câu trả lời của bạn:</p>

          {userAnswer.textAnswer && (
            <div className="rounded-lg bg-muted p-3">
              <p className="whitespace-pre-wrap text-sm">{userAnswer.textAnswer}</p>
            </div>
          )}

          {userAnswer.optionIds && userAnswer.optionIds.length > 0 && (
            <div className="space-y-1">
              {(userAnswer.optionTexts ?? userAnswer.optionIds).map((text: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
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
          <p className="text-sm font-medium text-green-600">Đáp án đúng:</p>

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
                    key={idx}
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

      {/* AI Feedback */}
      {aiFeedback && !isPending && (
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center gap-2 text-blue-600">
            <MessageSquare className="h-4 w-4" />
            <p className="text-sm font-medium">Nhận xét từ AI</p>
          </div>

          {aiFeedback.overallScore !== null && aiFeedback.overallScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Điểm tổng quan:</span>
              <span className="text-sm font-semibold">{aiFeedback.overallScore.toFixed(1)}/10</span>
            </div>
          )}

          {aiFeedback.dimensions && aiFeedback.dimensions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Đánh giá chi tiết:</p>
              {aiFeedback.dimensions.map((dim, idx: number) => (
                <div key={idx} className="space-y-1 rounded-lg bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dim.name}</span>
                    {dim.score !== null && dim.score !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        {dim.score.toFixed(1)}/10
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{dim.feedback}</p>
                </div>
              ))}
            </div>
          )}

          {aiFeedback.corrections && aiFeedback.corrections.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-600">Lỗi cần sửa:</p>
              <ul className="space-y-2">
                {aiFeedback.corrections.map((correction: CorrectionItem, idx: number) => (
                  <li key={idx} className="rounded-lg bg-orange-50 p-3 text-sm">
                    <div className="space-y-1">
                      <p>
                        <span className="text-orange-600 line-through">{correction.original}</span>
                        {" → "}
                        <span className="font-medium text-green-600">{correction.corrected}</span>
                      </p>
                      {correction.rule && (
                        <p className="text-xs text-muted-foreground">{correction.rule}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-600">Gợi ý cải thiện:</p>
              <ul className="space-y-1">
                {aiFeedback.suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-blue-600">•</span>
                    <span>{suggestion}</span>
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
