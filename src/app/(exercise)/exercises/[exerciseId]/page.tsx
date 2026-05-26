"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompleteExercise, useSubmitAnswer } from "@/hooks/exercise";
import type { ExerciseStartDto, PronunciationScores } from "@/types/dto/exercise";
import { ROUTES } from "@/config";
import { PawSpinner } from "@/components/shared/spinner";
import {
  AudioPlayer,
  ExerciseFooter,
  ExerciseHeader,
  FillBlankQuestion,
  ListeningQuestion,
  MatchingQuestion,
  ReadingQuestion,
  SpeakingQuestion,
  WritingQuestion,
} from "./_components";

type UserAnswer = {
  optionIds?: string[];
  textAnswer?: string;
  pronunciationScores?: PronunciationScores | null;
};

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exerciseId as string;

  const [exerciseData, setExerciseData] = useState<ExerciseStartDto | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);

  const submitAnswerMutation = useSubmitAnswer();
  const completeExerciseMutation = useCompleteExercise();

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

  if (!exerciseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <PawSpinner size="md" />
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

  const handleAnswerChange = (questionId: string, answer: UserAnswer) => {
    setAnswers((prev) => new Map(prev).set(questionId, answer));
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleComplete = async () => {
    setIsSubmittingAll(true);
    try {
      for (const [questionId, answer] of answers.entries()) {
        await submitAnswerMutation.mutateAsync({
          exerciseId,
          dto: { questionId, answer },
        });
      }
      await completeExerciseMutation.mutateAsync(exerciseId);
      router.push(ROUTES.EXERCISE.RESULT(exerciseId));
    } catch (error) {
      console.error("Failed to complete exercise:", error);
      setIsSubmittingAll(false);
    }
  };

  const handleNavigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to exit? Your progress will be lost.")) {
      sessionStorage.removeItem(`exercise_${exerciseId}`);
      router.push(ROUTES.LEARN.LESSONS);
    }
  };

  // ── Audio detection ────────────────────────────────────────────────
  // Có audioUrl → đây là câu listening
  const audioUrl = currentQuestion.passage?.audioUrl ?? null;
  const audioTitle = currentQuestion.passage?.title ?? null;
  const transcript = null;

  const renderQuestion = () => {
    const currentAnswer = answers.get(currentQuestion.questionId);

    // LISTENING: có audioUrl → dùng ListeningQuestion cho tất cả types
    if (audioUrl) {
      return (
        <ListeningQuestion
          key={currentQuestion.questionId}
          question={currentQuestion}
          selectedOptionIds={currentAnswer?.optionIds ?? []}
          onOptionChange={(optionIds) =>
            handleAnswerChange(currentQuestion.questionId, { optionIds })
          }
          textAnswer={currentAnswer?.textAnswer ?? ""}
          onTextChange={(text) =>
            handleAnswerChange(currentQuestion.questionId, { textAnswer: text })
          }
        />
      );
    }

    // NON-LISTENING: switch type như cũ
    switch (currentQuestion.type) {
      case "mcq_single":
      case "mcq_multi":
        return (
          <ReadingQuestion
            key={currentQuestion.questionId}
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
            key={currentQuestion.questionId}
            question={currentQuestion}
            textAnswer={currentAnswer?.textAnswer ?? ""}
            onAnswerChange={(text) =>
              handleAnswerChange(currentQuestion.questionId, { textAnswer: text })
            }
            passage={currentQuestion.passage ?? null}
          />
        );

      case "essay":
        return (
          <WritingQuestion
            key={currentQuestion.questionId}
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
              handleAnswerChange(currentQuestion.questionId, {
                ...currentAnswer,
                textAnswer: text,
              })
            }
            onPronunciationScoresChange={(scores) =>
              handleAnswerChange(currentQuestion.questionId, {
                ...currentAnswer,
                pronunciationScores: scores,
              })
            }
          />
        );

      case "matching":
        return (
          <MatchingQuestion
            key={currentQuestion.questionId}
            question={currentQuestion}
            textAnswer={currentAnswer?.textAnswer ?? ""}
            onAnswerChange={(json) =>
              handleAnswerChange(currentQuestion.questionId, { textAnswer: json })
            }
          />
        );

      default:
        return <div className="p-8 text-gray-400">Unknown question type</div>;
    }
  };

  return (
    <div className="relative flex h-screen flex-col bg-gray-50">
      {/* Loading overlay */}
      {isSubmittingAll && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <PawSpinner size="lg" />
          <p className="mt-4 text-body-l font-medium text-teal-700">Submitting your answers...</p>
          <p className="mt-1 text-body-m text-gray-500">Please don&apos;t close this page</p>
        </div>
      )}

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

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {audioUrl && <AudioPlayer audioUrl={audioUrl} transcript={transcript} title={audioTitle} />}
        {renderQuestion()}
      </div>

      <ExerciseFooter
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        hasAnswer={answers.has(currentQuestion.questionId)}
        isLastQuestion={isLastQuestion}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onComplete={handleComplete}
        isSubmitting={isSubmittingAll}
      />
    </div>
  );
}
