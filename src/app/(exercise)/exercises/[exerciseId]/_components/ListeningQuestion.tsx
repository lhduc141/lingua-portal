"use client";

import type { AssessmentQuestionDto } from "@/types/dto/exercise";
import { cn } from "@/lib";

interface ListeningQuestionProps {
  question: AssessmentQuestionDto;
  // mcq_single / mcq_multi
  selectedOptionIds?: string[];
  onOptionChange?: (optionIds: string[]) => void;
  // fill_blank / dictation
  textAnswer?: string;
  onTextChange?: (text: string) => void;
}

export function ListeningQuestion({
  question,
  selectedOptionIds = [],
  onOptionChange,
  textAnswer = "",
  onTextChange,
}: ListeningQuestionProps) {
  const type = question.type;

  if (type === "mcq_single" || type === "mcq_multi") {
    const isMulti = type === "mcq_multi";

    const handleOptionClick = (optionId: string) => {
      if (!onOptionChange) return;
      if (isMulti) {
        const next = selectedOptionIds.includes(optionId)
          ? selectedOptionIds.filter((id) => id !== optionId)
          : [...selectedOptionIds, optionId];
        onOptionChange(next);
      } else {
        onOptionChange([optionId]);
      }
    };

    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          {/* Stem */}
          <div className="mb-6">
            <p className="text-body-l font-medium text-gray-900">{question.stemText}</p>
            {isMulti && <p className="mt-2 text-caption text-gray-500">Select all that apply</p>}
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
                    "rounded-xl border-2 p-4 text-left transition-all",
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
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

  if (type === "fill_blank") {
    const parts = question.stemText?.split("___") ?? [""];

    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="mb-6 text-body-m text-gray-600">Listen and fill in the missing word</p>
          <div className="flex flex-wrap items-center gap-2 text-body-l leading-relaxed text-gray-900">
            {parts.map((part, index) => (
              <span key={index} className="inline-flex items-center gap-2">
                <span>{part}</span>
                {index < parts.length - 1 && (
                  <input
                    type="text"
                    value={textAnswer}
                    onChange={(e) => onTextChange?.(e.target.value)}
                    className="inline-block min-w-[180px] rounded-lg border-2 border-gray-300 px-3 py-2 text-body-l transition-colors focus:border-emerald-500 focus:outline-none"
                    placeholder="Type the missing word..."
                    autoFocus
                  />
                )}
              </span>
            ))}
          </div>
          <p className="mt-6 text-caption text-gray-500">
            Hint: Listen carefully to the audio above
          </p>
        </div>
      </div>
    );
  }
  
  if (type === "dictation") {
    const wordCount = textAnswer.trim().split(/\s+/).filter(Boolean).length;

    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          {/* Prompt */}
          <div className="mb-6">
            <h2 className="mb-2 font-serif text-[22px] text-gray-900">Dictation</h2>
            <p className="text-[15px] leading-relaxed text-gray-600">
              {question.stemText ?? "Listen to the audio and type exactly what you hear."}
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={textAnswer}
            onChange={(e) => onTextChange?.(e.target.value)}
            rows={5}
            autoFocus
            placeholder="Type exactly what you hear..."
            className="w-full resize-none rounded-xl border-2 border-gray-200 p-4 text-[15px] leading-relaxed text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          {/* Word count */}
          <div className="mt-2 flex justify-end">
            <p className="text-[12px] text-gray-400">
              {wordCount} word{wordCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Tips */}
          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-emerald-50 p-3 text-[13px] text-emerald-700">
              <span className="font-semibold">Tips:</span> You can replay the audio as many times as
              needed. Focus on spelling and punctuation.
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-[13px] text-amber-700">
              Your answer will be compared word-by-word — minor punctuation differences are
              accepted.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
