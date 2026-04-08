"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/config";
import { useLessonDetail } from "@/hooks/learn";
import { startLessonExercise } from "@/services/learn";
import { PawSpinner } from "@/components/shared/spinner";
import { cn } from "@/lib";

import { LessonHeaderCard, QuestionsTab, TheoryTab } from "./_components";

type Tab = "theory" | "questions";

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("theory");
  const [isStarting, setIsStarting] = useState(false);

  const { data: lesson, isLoading, error } = useLessonDetail(lessonId);

  const handleStartLesson = async () => {
    if (!lessonId) return;
    setIsStarting(true);
    try {
      const res = await startLessonExercise(lessonId);
      const exerciseRecordId = res.data?.exerciseRecordId ?? res.data?.exerciseRecordId;
      sessionStorage.setItem(`exercise_${res.data.exerciseRecordId}`, JSON.stringify(res.data));

      router.push(ROUTES.EXERCISE.DETAIL(exerciseRecordId));
    } catch (err) {
      console.error("Failed to start lesson:", err);
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <PawSpinner />
      </div>
    );
  }

  if (error || !lesson) {
    return <div className="py-16 text-center text-slate-400">Lesson not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      {/* Header card */}
      <LessonHeaderCard
        lesson={lesson}
        onStart={() => void handleStartLesson()}
        isStarting={isStarting}
      />

      {/* Tab bar */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("theory")}
            className={cn(
              "pb-3 text-[14px] font-bold transition-colors",
              activeTab === "theory"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Theory
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={cn(
              "flex items-center gap-2 pb-3 text-[14px] font-bold transition-colors",
              activeTab === "questions"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Questions
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {lesson.questions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="pt-2">
        {activeTab === "theory" ? (
          <TheoryTab theoryContent={lesson.theoryContent} />
        ) : (
          <QuestionsTab questions={lesson.questions} />
        )}
      </div>
    </div>
  );
}
