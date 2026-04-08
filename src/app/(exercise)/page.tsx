"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompleteExercise, useSubmitAnswer } from "@/hooks/exercise";
import type { ExerciseStartDto } from "@/types/dto/exercise";
import { ROUTES } from "@/config";
import {
  ExerciseFooter,
  ExerciseHeader,
  FillBlankQuestion,
  ReadingQuestion,
  SpeakingQuestion,
  WritingQuestion,
} from "./_components";

type UserAnswer = {
  optionIds?: string[];
  textAnswer?: string;
};

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;

  const [exerciseData, setExerciseData] = useState<ExerciseStartDto | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map());

  const submitAnswerMutation = useSubmitAnswer();
  const completeExerciseMutation = useCompleteExercise();

  // Load exercise data từ sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(`exercise_${exerciseId}`);
    if (stored)
      try {
        const data = JSON.parse(stored) as ExerciseStartDto;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExerciseData(data);
      } catch (error) {
        console.error("Failed to parse exercise data:", error);
        router.push(ROUTES.LEARN.LESSONS);
      }
    else router.push(ROUTES.LEARN.LESSONS);
  }, [exerciseId, router]);

  // Early return nếu chưa load xong
  if (!exerciseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-body-l text-gray-500">Loading exercise...</div>
      </div>
    );
  }

  const currentQuestion = exerciseData.questions[currentQuestionIndex];
  const totalQuestions = exerciseData.questions.length;

  if (!currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-body-l text-red-500">Error: Question not found</div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Handler: Lưu answer vào state
  const handleAnswerChange = (questionId: string, answer: UserAnswer) => {
    setAnswers((prev) => new Map(prev).set(questionId, answer));
  };

  // Handler: Submit answer hiện tại → next question
  const handleNext = async () => {
    const currentAnswer = answers.get(currentQuestion.questionId);

    // Submit nếu có answer
    if (currentAnswer) {
      try {
        await submitAnswerMutation.mutateAsync({
          exerciseId,
          dto: {
            questionId: currentQuestion.questionId,
            answer: currentAnswer,
          },
        });
      } catch (error) {
        console.error("Failed to submit answer:", error);
        // Tiếp tục next dù submit fail (có thể retry sau)
      }
    }

    // Next question
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Handler: Previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handler: Complete exercise
  const handleComplete = async () => {
    // Submit current answer nếu chưa submit
    const currentAnswer = answers.get(currentQuestion.questionId);
    if (currentAnswer) {
      try {
        await submitAnswerMutation.mutateAsync({
          exerciseId,
          dto: {
            questionId: currentQuestion.questionId,
            answer: currentAnswer,
          },
        });
      } catch (error) {
        console.error("Failed to submit final answer:", error);
      }
    }

    // Complete exercise
    try {
      await completeExerciseMutation.mutateAsync(exerciseId);
      // Navigate to result
      router.push(ROUTES.EXERCISE.RESULT(exerciseId));
    } catch (error) {
      console.error("Failed to complete exercise:", error);
    }
  };

  // Handler: Navigate to specific question
  const handleNavigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Handler: Exit
  const handleExit = () => {
    if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
      sessionStorage.removeItem(`exercise_${exerciseId}`);
      router.push(ROUTES.LEARN.LESSONS);
    }
  };

  // Render question dựa vào type
  const renderQuestion = () => {
    const currentAnswer = answers.get(currentQuestion.questionId);

    switch (currentQuestion.type) {
      case "mcq_single":
      case "mcq_multi":
        return (
          <ReadingQuestion
            question={currentQuestion}
            selectedOptionIds={currentAnswer?.optionIds ?? []}
            onAnswerChange={(optionIds) =>
              handleAnswerChange(currentQuestion.questionId, { optionIds })
            }
          />
        );

      case "fill_blank":
        return (
          <FillBlankQuestion
            question={currentQuestion}
            textAnswer={currentAnswer?.textAnswer ?? ""}
            onAnswerChange={(text) =>
              handleAnswerChange(currentQuestion.questionId, { textAnswer: text })
            }
          />
        );

      case "essay":
        return (
          <WritingQuestion
            question={currentQuestion}
            textAnswer={currentAnswer?.textAnswer ?? ""}
            onAnswerChange={(text) =>
              handleAnswerChange(currentQuestion.questionId, { textAnswer: text })
            }
          />
        );

      case "speaking":
        return (
          <SpeakingQuestion
            question={currentQuestion}
            textAnswer={currentAnswer?.textAnswer ?? ""}
            onAnswerChange={(text) =>
              handleAnswerChange(currentQuestion.questionId, { textAnswer: text })
            }
          />
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <ExerciseHeader
        title={exerciseData.lesson?.title ?? exerciseData.questionSet?.title ?? "Exercise"}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onExit={handleExit}
        onNavigateToQuestion={handleNavigateToQuestion}
        answeredQuestions={Array.from(answers.keys())}
        questions={exerciseData.questions}
      />

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">{renderQuestion()}</div>

      {/* Footer */}
      <ExerciseFooter
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        hasAnswer={answers.has(currentQuestion.questionId)}
        isLastQuestion={isLastQuestion}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onComplete={handleComplete}
        isSubmitting={submitAnswerMutation.isPending || completeExerciseMutation.isPending}
      />
    </div>
  );
}
