"use client";

import { useMemo } from "react";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface WritingQuestionProps {
  question: AssessmentQuestionDto;
  textAnswer: string;
  onAnswerChange: (text: string) => void;
}

export function WritingQuestion({
  question,
  textAnswer,
  onAnswerChange,
}: WritingQuestionProps) {
  const wordCount = useMemo(() => {
    return textAnswer.trim().split(/\s+/).filter(Boolean).length;
  }, [textAnswer]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        {/* Question */}
        <div className="mb-6">
          <h3 className="mb-3 text-h2 font-serif text-gray-900">Writing Task</h3>
          <p className="text-body-l text-gray-700">{question.stemText}</p>
        </div>

        {/* Textarea */}
        <textarea
          value={textAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="mb-3 h-64 w-full resize-none rounded-lg border-2 border-gray-300 p-4 text-body-l text-gray-900 transition-colors focus:border-teal-600 focus:outline-none"
          placeholder="Type your answer here..."
          autoFocus
        />

        {/* Word count */}
        <div className="flex items-center justify-between text-caption">
          <p className="text-gray-500">Write at least 150 words</p>
          <p
            className={
              wordCount >= 150 ? "font-medium text-teal-600" : "text-gray-500"
            }
          >
            {wordCount} words
          </p>
        </div>

        {/* Tips */}
        <div className="mt-6 rounded-lg bg-amber-50 p-4">
          <p className="text-body-m text-amber-900">
            <span className="font-semibold">Tips:</span> Organize your ideas clearly, use
            varied vocabulary, and check grammar before submitting.
          </p>
        </div>
      </div>
    </div>
  );
}
