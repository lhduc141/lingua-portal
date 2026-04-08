"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib";

interface ExerciseFooterProps {
  currentQuestion: number;
  totalQuestions: number;
  hasAnswer: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

export function ExerciseFooter({
  currentQuestion,
  totalQuestions,
  hasAnswer,
  isLastQuestion,
  onPrevious,
  onNext,
  onComplete,
  isSubmitting,
}: ExerciseFooterProps) {
  return (
    <div className="border-t border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Previous button */}
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-body-m font-medium transition-colors",
            currentQuestion === 1
              ? "cursor-not-allowed text-gray-400"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        {/* Question counter */}
        <div className="text-body-m text-gray-600">
          Question {currentQuestion} of {totalQuestions}
        </div>

        {/* Next / Submit button */}
        {isLastQuestion ? (
          <button
            onClick={onComplete}
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2 text-body-m font-semibold text-white transition-colors",
              isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : hasAnswer
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-400 hover:bg-gray-500"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit All"}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2 text-body-m font-semibold text-white transition-colors",
              isSubmitting
                ? "cursor-not-allowed bg-gray-400"
                : hasAnswer
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-400 hover:bg-gray-500"
            )}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
