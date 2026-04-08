"use client";

import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface FillBlankQuestionProps {
  question: AssessmentQuestionDto;
  textAnswer: string;
  onAnswerChange: (text: string) => void;
}

export function FillBlankQuestion({
  question,
  textAnswer,
  onAnswerChange,
}: FillBlankQuestionProps) {
  // Parse stemText: "The cat is _____ the table." → ["The cat is ", " the table."]
  const parts = question.stemText?.split("_____") ?? [""];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        {/* Instruction */}
        <p className="mb-6 text-body-m text-gray-600">
          Fill in the blank with the correct word or phrase
        </p>

        {/* Question with inline input */}
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

        {/* Helper text */}
        <p className="mt-6 text-caption text-gray-500">
          Hint: Pay attention to grammar and spelling
        </p>
      </div>
    </div>
  );
}
