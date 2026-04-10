"use client";

import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface FillBlankQuestionProps {
  question: AssessmentQuestionDto;
  textAnswer: string;
  onAnswerChange: (text: string) => void;
  passage?: {
    title: string | null;
    content: string;
  } | null;
}

export function FillBlankQuestion({
  question,
  textAnswer,
  onAnswerChange,
  passage,
}: FillBlankQuestionProps) {
  const parts = question.stemText?.split("___") ?? [""];

  // 2-col layout nếu có passage (reading fill_blank)
  if (passage) {
    return (
      <div className="flex h-full gap-6">
        {/* Left: Passage */}
        <div className="w-[55%] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6">
          {passage.title && (
            <h2 className="mb-4 font-serif text-h2 text-gray-900">{passage.title}</h2>
          )}
          <p className="text-body-m leading-relaxed text-gray-700">{passage.content}</p>
        </div>

        {/* Right: Fill blank */}
        <div className="flex w-[45%] flex-col justify-center rounded-lg border border-gray-200 bg-white p-6">
          <p className="mb-6 text-body-m text-gray-600">
            Fill in the blank with the correct word from the passage
          </p>
          <div className="flex flex-wrap items-center gap-2 text-body-l leading-relaxed text-gray-900">
            {parts.map((part, index) => (
              <span key={index} className="inline-flex items-center gap-2">
                <span>{part}</span>
                {index < parts.length - 1 && (
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="inline-block min-w-[160px] rounded-md border-2 border-gray-300 px-3 py-2 text-body-l transition-colors focus:border-teal-600 focus:outline-none"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                )}
              </span>
            ))}
          </div>
          <p className="mt-6 text-caption text-gray-500">
            Hint: The answer can be found in the passage
          </p>
        </div>
      </div>
    );
  }

  // Single col layout (writing fill_blank — không có passage)
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <p className="mb-6 text-body-m text-gray-600">
          Fill in the blank with the correct word or phrase
        </p>
        <div className="flex flex-wrap items-center gap-2 text-body-l leading-relaxed text-gray-900">
          {parts.map((part, index) => (
            <span key={index} className="inline-flex items-center gap-2">
              <span>{part}</span>
              {index < parts.length - 1 && (
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="inline-block min-w-[200px] rounded-md border-2 border-gray-300 px-3 py-2 text-body-l transition-colors focus:border-teal-600 focus:outline-none"
                  placeholder="Type your answer..."
                  autoFocus
                />
              )}
            </span>
          ))}
        </div>
        <p className="mt-6 text-caption text-gray-500">
          Hint: Pay attention to grammar and spelling
        </p>
      </div>
    </div>
  );
}