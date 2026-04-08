"use client";

import { QuestionPanel } from "./QuestionPanel";
import { PawIcon } from "@/components/svg";
import { PlacementSessionData } from "@/types";
import { useState } from "react";

interface PlacementTestViewProps {
  session: PlacementSessionData;

  handleSubmitAnswer: (optionId: string) => void;
  handleSkip: () => void;

  isSubmitting: boolean;
}

export function PlacementTestView({
  session,
  handleSubmitAnswer,
  isSubmitting,
  handleSkip,
}: PlacementTestViewProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);

  // Handle function
  const handleOptionClick = (optionId: string) => setSelectedOptionId(optionId);
  const handleConfirmSubmitAnswer = () => {
    if (!selectedOptionId) {
      setShowError(true);
      return;
    }

    if (isSubmitting) return;
    handleSubmitAnswer(selectedOptionId);
    setSelectedOptionId(null); // reset for next question
  };

  const { currentQuestion, questionOrder, progress } = session;

  return (
    <div className={`h-screen w-screen bg-[#F8FAFC]`}>
      {/* HEADER */}
      <section className={`flex min-h-[5vh] items-center justify-between px-12`}>
        <div className="flex items-center space-x-2">
          <PawIcon />
          <div className="font-serif text-[20px] font-semibold text-black">LinguaPanda</div>
        </div>
        <div className="flex flex-col">
          <div className="flex min-w-[15vw] justify-between">
            <div>
              <span className="text-[14px] font-semibold text-gray-600">
                Question {questionOrder} of ~{progress.maxQuestions}
              </span>
            </div>
            <div className="text-[14px] font-bold text-teal-600">
              {Math.round((progress.questionsAnswered / progress.maxQuestions) * 100)}% Complete
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full border bg-gray-200">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300"
              style={{ width: `${(progress.questionsAnswered / progress.maxQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="">
          <button onClick={handleSkip} className="transition-all hover:font-bold">
            Skip
          </button>
        </div>
      </section>

      {/* BODY */}
      <section className="py-auto flex h-[calc(100vh-10vh)] w-full items-center justify-center pt-8">
        {/* CASE 1: Có passage → 2 cột */}
        {currentQuestion.passageId ? (
          <div className="flex h-full w-[calc(80vw)] px-8">
            {/* Cột trái — Passage */}
            <div className="w-1/2 flex-1 overflow-y-auto border border-gray-100 bg-white p-6 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-600">
                Read the passage
              </p>
              <h2 className="mb-4 font-serif text-xl font-bold text-gray-900">
                {currentQuestion.passage?.title}
              </h2>
              <p className="text-normal leading-relaxed text-gray-700">
                {currentQuestion.passage?.content}
              </p>
            </div>

            {/* Cột phải — Question */}
            <div className="h-full w-1/2 shrink-0">
              <QuestionPanel
                currentQuestion={currentQuestion}
                questionOrder={questionOrder}
                selectedOptionId={selectedOptionId}
                showError={showError}
                isSubmitting={isSubmitting}
                onOptionClick={handleOptionClick}
                onConfirm={handleConfirmSubmitAnswer}
              />
            </div>
          </div>
        ) : (
          // CASE 2: Không có passage → centered single column
          <div className="w-[50vw]">
            <QuestionPanel
              currentQuestion={currentQuestion}
              questionOrder={questionOrder}
              selectedOptionId={selectedOptionId}
              showError={showError}
              isSubmitting={isSubmitting}
              onOptionClick={handleOptionClick}
              onConfirm={handleConfirmSubmitAnswer}
            />
          </div>
        )}
      </section>
    </div>
  );
}
