"use client";

import { useCurrentPlan, useGeneratePlan, useUpdatePlanItem } from "@/hooks/plan";
import { PawSpinner } from "@/components/shared/spinner";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { Flame, RefreshCw } from "lucide-react";
import type { PlanDayStatus, PlanTaskDto } from "@/types/dto/plan";
import { resetPlan } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { DayColumn, EmptyPlan } from "./_components";

export default function PlanPage() {
  const { data, isLoading, error } = useCurrentPlan();
  const queryClient = useQueryClient();
  const generateMutation = useGeneratePlan();
  const updateMutation = useUpdatePlanItem();
  const router = useRouter();

  const handleComplete = (itemId: string) => {
    void updateMutation.mutate({ itemId, dto: { status: "completed" } });
  };
  const handleSkip = (itemId: string) => {
    void updateMutation.mutate({ itemId, dto: { status: "skipped" } });
  };
  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync(undefined);
    } catch (err: any) {
      console.error("Generate error:", err?.response?.data);
    }
  };
  const handleReset = async () => {
    try {
      await resetPlan();
      await queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
    } catch (err: any) {
      console.error("Reset error:", err?.response?.data);
    }
  };

  if (isLoading) return <PawSpinner fullScreen />;

  if (!data || error) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-[32px] text-gray-900">My Learning Plan</h1>
        <EmptyPlan onGenerate={handleGenerate} isGenerating={generateMutation.isPending} />
      </div>
    );
  }

  const { planCycle, weekNumber, overallProgress, totalDays, completedDays, days } = data;
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[32px] text-gray-900">
            Cycle {planCycle} — Week {weekNumber}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative h-3 w-[420px] rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-3 rounded-full bg-[#157868] transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-[14px] font-bold text-slate-400">
              {overallProgress.toFixed(0)}% Complete ({completedDays}/{totalDays} tasks)
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(ROUTES.EXERCISE.HISTORY)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[14px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Review Plan
          </button>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-[14px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", generateMutation.isPending && "animate-spin")} />
            {generateMutation.isPending ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-[13px] font-medium text-red-400 hover:bg-red-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {days.map(
          (
            planDay: {
              date: any;
              day: any;
              totalTasks?: number;
              status?: PlanDayStatus;
              tasks?: PlanTaskDto[];
            },
            idx: number
          ) => (
            <DayColumn
              key={planDay.date}
              planDay={planDay}
              idx={idx}
              isToday={planDay.date === todayStr}
              onComplete={handleComplete}
              onSkip={handleSkip}
              isLoading={updateMutation.isPending}
            />
          )
        )}
      </div>

      {/* Banner */}
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col justify-between rounded-xl bg-[#1a9d8b] p-6 text-white shadow">
          <div>
            <h2 className="font-serif text-[28px] leading-tight">Keep it up! 🎉</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-white/80">
              Your AI plan is tailored to your pace. Complete today&apos;s tasks to keep your streak
              alive and unlock next week&apos;s content.
            </p>
          </div>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="font-serif text-[28px]">
                {totalDays > 0 ? `${Math.round((completedDays / totalDays) * 7)} Days` : "0 Days"}
              </p>
              <p className="text-[12px] text-white/70">This Week</p>
            </div>
            <div>
              <p className="font-serif text-[28px]">{overallProgress.toFixed(0)}%</p>
              <p className="text-[12px] text-white/70">Progress</p>
            </div>
          </div>
        </div>

        <div className="flex w-[300px] shrink-0 flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h3 className="font-serif text-[20px] text-gray-900">Stay Consistent</h3>
            <p className="mt-2 text-[12px] text-slate-500">
              Daily practice is the key to mastery. Even 15 minutes a day compounds into fluency.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">Keep your streak!</p>
              <p className="text-[11px] text-slate-400">Complete at least 1 task today</p>
            </div>
          </div>
          <button
            onClick={() => router.push(ROUTES.LEARN.ROOT)}
            className="mt-4 w-full rounded-lg bg-teal-50 py-2.5 text-[13px] font-bold text-teal-700 hover:bg-teal-100"
          >
            Browse Lessons →
          </button>
        </div>
      </div>
    </div>
  );
}
