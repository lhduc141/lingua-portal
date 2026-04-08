"use client";

import { X, Circle, CheckCircle } from "lucide-react";
import type { AssessmentQuestionDto } from "@/types/dto/exercise";

interface ExerciseHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  onExit: () => void;
  onNavigateToQuestion: (index: number) => void;
  answeredQuestions: string[]; // questionIds đã trả lời
  questions: AssessmentQuestionDto[];
}

export function ExerciseHeader({
  title,
  currentQuestion,
  totalQuestions,
  onExit,
  onNavigateToQuestion,
  answeredQuestions,
  questions,
}: ExerciseHeaderProps) {
  const progressPercent = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="border-b border-gray-200 bg-white px-8 py-4">
      {/* Top row: Exit + Title */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <X className="h-5 w-5" />
          <span className="text-body-m font-medium">Exit</span>
        </button>

        <h1 className="text-h2 font-serif text-gray-900">{title}</h1>

        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question navigator dots */}
      <div className="flex items-center justify-center gap-2">
        {questions.map((q, index) => {
          const isAnswered = answeredQuestions.includes(q.questionId);
          const isCurrent = index + 1 === currentQuestion;

          return (
            <button
              key={q.questionId}
              onClick={() => onNavigateToQuestion(index)}
              className="transition-transform hover:scale-110"
              aria-label={`Go to question ${index + 1}`}
            >
              {isAnswered ? (
                <CheckCircle
                  className={`h-6 w-6 ${
                    isCurrent ? "text-teal-600" : "text-gray-400"
                  }`}
                />
              ) : (
                <Circle
                  className={`h-6 w-6 ${
                    isCurrent ? "text-teal-600" : "text-gray-300"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
