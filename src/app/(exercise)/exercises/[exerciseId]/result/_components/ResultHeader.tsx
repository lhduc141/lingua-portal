"use client";

import { CheckCircle2, Clock, Target } from "lucide-react";
import type { ExerciseResultDto } from "@/types";

type ResultHeaderProps = {
  result: ExerciseResultDto;
};

export function ResultHeader({ result }: ResultHeaderProps) {
  const { score, totalQuestions, correctCount, startedAt, completedAt } = result;

  const timeSpent = completedAt
    ? Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000 / 60)
    : 0;

  const percentage = score !== null ? Math.round(score) : 0;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className="mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <span className="text-4xl font-bold text-primary">{percentage}%</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold">Exercise Result</h1>
        <p className="text-muted-foreground">
          You completed this exercise with <strong>{percentage}%</strong> score
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Correct</p>
            <p className="text-xl font-semibold">
              {correctCount}/{totalQuestions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-xl font-semibold">{percentage}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="text-xl font-semibold">{timeSpent} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}