"use client";

import type { AssessmentQuestionDto } from "@/types/dto/exercise";
import { cn } from "@/lib";

interface ReadingQuestionProps {
  question: AssessmentQuestionDto;
  selectedOptionIds: string[];
  onAnswerChange: (optionIds: string[]) => void;
}

export function ReadingQuestion({
  question,
  selectedOptionIds,
  onAnswerChange,
}: ReadingQuestionProps) {
  const isMultiChoice = question.type === "mcq_multi";

  const handleOptionClick = (optionId: string) => {
    if (isMultiChoice) {
      // Multiple choice: toggle
      if (selectedOptionIds.includes(optionId)) {
        onAnswerChange(selectedOptionIds.filter((id) => id !== optionId));
      } else {
        onAnswerChange([...selectedOptionIds, optionId]);
      }
    } else {
      // Single choice: replace
      onAnswerChange([optionId]);
    }
  };

  return (
    <div className="grid h-full grid-cols-[55%_45%] gap-6">
      {/* Left: Passage (nếu có) */}
      {question.passage && (
        <div className="overflow-y-auto rounded-lg border border-gray-200 bg-white p-6">
          {question.passage.title && (
            <h3 className="mb-4 text-h2 font-serif text-gray-900">
              {question.passage.title}
            </h3>
          )}
          <div className="prose prose-gray max-w-none text-body-l leading-relaxed text-gray-700">
            {question.passage.content}
          </div>
        </div>
      )}

      {/* Right: Question + Options */}
      <div className="flex flex-col">
        {/* Question stem */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-body-l font-medium text-gray-900">{question.stemText}</p>
          {isMultiChoice && (
            <p className="mt-2 text-caption text-gray-500">Select all that apply</p>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option) => {
            const isSelected = selectedOptionIds.includes(option.optionId);

            return (
              <button
                key={option.optionId}
                onClick={() => handleOptionClick(option.optionId)}
                className={cn(
                  "rounded-lg border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Radio/Checkbox indicator */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2",
                      isSelected
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>

                  {/* Option text */}
                  <span className="text-body-m text-gray-900">{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
