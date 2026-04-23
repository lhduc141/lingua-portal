"use client";

import { useState } from "react";
import { useCurrentPlan, useGeneratePlan, useUpdatePlanItem } from "@/hooks/plan";
import { useDashboardOverview, useDashboardStreak } from "@/hooks";
import { useAuthStore } from "@/stores";
import { PawSpinner } from "@/components/shared/spinner";
import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { AlertTriangle, History, RefreshCw } from "lucide-react";
import type { PlanDayStatus, PlanTaskDto } from "@/types/dto/plan";
import { resetPlan } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyPlan, WeeklyReviewModal } from "./_components";
import { DayCard } from "./_components/DayCard";
import { ReviewCard } from "./_components/ReviewCard";
import { PlanInsightBanner } from "./_components/PlanInsightBanner";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

type PlanDayShape = {
  date: string;
  day: number;
  totalTasks?: number;
  status?: PlanDayStatus;
  tasks?: PlanTaskDto[];
};

// Luôn generate đủ MON–SUN của tuần hiện tại
function buildFullWeek(startDate: string, days: PlanDayShape[]): PlanDayShape[] {
  const tasksByDate = new Map(days.map((d) => [d.date, d]));
  const result: PlanDayShape[] = [];

  // Tìm Monday của tuần chứa startDate
  const ref = new Date(startDate + "T12:00:00");
  const dow = ref.getDay(); // 0=Sun
  const daysToMonday = dow === 0 ? 6 : dow - 1;
  const monday = new Date(ref);
  monday.setDate(monday.getDate() - daysToMonday);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push(tasksByDate.get(dateStr) ?? { date: dateStr, day: i + 1, tasks: [] });
  }
  return result; // MON[0]...SUN[6]
}

export default function PlanPage() {
  const { data, isLoading, error } = useCurrentPlan();
  const { data: dashData } = useDashboardOverview();
  const { data: streakData } = useDashboardStreak();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const generateMutation = useGeneratePlan();
  const updateMutation = useUpdatePlanItem();
  const router = useRouter();

  const [reviewTask, setReviewTask] = useState<PlanTaskDto | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  const handleComplete = (itemId: string) =>
    void updateMutation.mutate({ itemId, dto: { status: "completed" } });
  const handleSkip = (itemId: string) =>
    void updateMutation.mutate({ itemId, dto: { status: "skipped" } });
  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync(undefined);
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  };
  const handleReset = async () => {
    try {
      await resetPlan();
      await queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
    } catch (err: any) {
      console.error(err?.response?.data);
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

  const {
    planCycle,
    weekNumber,
    overallProgress,
    totalDays,
    completedDays,
    days,
    endDate,
    startDate,
  } = data;
  const isPlanExpired = endDate && endDate < todayStr;

  const fullWeek = buildFullWeek(startDate, days as PlanDayShape[]);
  // SUN (index 6) = review day
  const reviewDay = fullWeek[6];
  // MON–SAT (index 0–5)
  const regularDays = fullWeek.slice(0, 6);

  return (
    <>
      {reviewTask && <WeeklyReviewModal task={reviewTask} onClose={() => setReviewTask(null)} />}

      <div className="space-y-5">
        {/* Expired banner */}
        {isPlanExpired && (
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <p className="text-[14px] font-semibold text-amber-800">
                  This plan ended on{" "}
                  {new Date(endDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  .
                </p>
                <p className="text-[13px] text-amber-600">Generate a new plan to continue.</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-bold text-white hover:bg-amber-600 disabled:opacity-60"
            >
              <RefreshCw className={cn("h-4 w-4", generateMutation.isPending && "animate-spin")} />
              {generateMutation.isPending ? "Generating..." : "Generate New Plan"}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-[36px] text-gray-900">Learning Plan</h1>
            <p className="mt-1 text-[14px] font-medium text-slate-500">
              Cycle {planCycle} · Week {weekNumber} ·{" "}
              {new Date(startDate + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {" – "}
              {new Date(endDate + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(ROUTES.PLAN_HISTORY)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <History className="h-4 w-4" />
              History
            </button>
            <button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-[13px] font-bold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              <RefreshCw className={cn("h-4 w-4", generateMutation.isPending && "animate-spin")} />
              {generateMutation.isPending ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-[13px] font-medium text-red-400 hover:bg-red-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="relative h-2 flex-1 rounded-full bg-gray-200">
            <div
              className="absolute left-0 top-0 h-2 rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="shrink-0 text-[13px] font-semibold text-slate-500">
            {overallProgress.toFixed(0)}% · {completedDays}/{totalDays} tasks done
          </span>
        </div>

        {/* ─── MAIN LAYOUT: Grid left + Right panel ─── */}
        <div className="flex gap-4">
          {/* LEFT: 3x2 day grid (MON–SAT) */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-3">
              {regularDays.map((planDay) => {
                const dateObj = new Date(planDay.date + "T12:00:00");
                const dayLabel = DAY_NAMES[dateObj.getDay()] ?? "MON";
                const isToday = planDay.date === todayStr;
                const isPast = planDay.date < todayStr;
                const tasks = (planDay.tasks ?? []).filter((t) => t.itemType !== "weekly_review");

                return (
                  <DayCard
                    key={planDay.date}
                    date={planDay.date}
                    dayLabel={dayLabel}
                    isToday={isToday}
                    isPast={isPast}
                    tasks={tasks}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                    onReviewClick={setReviewTask}
                    isLoading={updateMutation.isPending}
                    todayStr={todayStr}
                  />
                );
              })}
            </div>
          </div>

          {/* RIGHT: Review card + Insight panel stacked */}
          <div className="flex w-[260px] shrink-0 flex-col gap-3">
            {/* SUN Review card */}
            {reviewDay && (
              <ReviewCard planDay={reviewDay} onReviewClick={setReviewTask} todayStr={todayStr} />
            )}

            {/* Insight panel */}
            {dashData && (
              <PlanInsightBanner
                userName={user?.displayName?.split(" ")[0] ?? "there"}
                streak={streakData?.currentDays ?? dashData.streak?.currentDays ?? 0}
                skillSummary={dashData.skillSummary}
                planProgress={overallProgress}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
