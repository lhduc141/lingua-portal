"use client";

import { CheckCircle2, Clock, Target } from "lucide-react";
import type { ExerciseResultDto } from "@/types";

type ResultHeaderProps = {
  result: ExerciseResultDto;
};

export function ResultHeader({ result }: ResultHeaderProps) {
  const { score, totalQuestions, correctCount, startedAt, completedAt } = result;

  // Calculate time spent
  const timeSpent = completedAt
    ? Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000 / 60)
    : 0;

  // Calculate percentage
  const percentage = score !== null ? Math.round(score) : 0;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className="mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <span className="text-4xl font-bold text-primary">{percentage}%</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold">Kết quả bài tập</h1>
        <p className="text-muted-foreground">Bạn đã hoàn thành bài tập với {percentage}% điểm số</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Correct Count */}
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Câu đúng</p>
            <p className="text-xl font-semibold">
              {correctCount}/{totalQuestions}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Điểm số</p>
            <p className="text-xl font-semibold">{percentage}%</p>
          </div>
        </div>

        {/* Time Spent */}
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Thời gian</p>
            <p className="text-xl font-semibold">{timeSpent} phút</p>
          </div>
        </div>
      </div>
    </div>
  );
}
