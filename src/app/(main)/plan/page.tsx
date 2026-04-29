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
import { PlanInsightBanner } from "./_components/PlanInsightBanner";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

type PlanDayShape = {
  date: string;
  day: number;
  totalTasks?: number;
  status?: PlanDayStatus;
  tasks?: PlanTaskDto[];
};

// Vietnam timezone helper
function toVNDateStr(date = new Date()): string {
  const vn = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const y = vn.getFullYear();
  const m = String(vn.getMonth() + 1).padStart(2, "0");
  const d = String(vn.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildFullWeek(weekStartDate: string, days: PlanDayShape[]): PlanDayShape[] {
  const tasksByDate = new Map(days.map((d) => [d.date, d]));
  const result: PlanDayShape[] = [];

  const monday = new Date(weekStartDate + "T12:00:00");

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const dateStr = toVNDateStr(d);
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
  const todayStr = toVNDateStr();

  const handleComplete = (itemId: string) =>
    void updateMutation.mutate({ itemId, dto: { status: "completed" } });
  const handleSkip = (itemId: string) =>
    void updateMutation.mutate({ itemId, dto: { status: "skipped" } });
  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync(undefined);
      await queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
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

  const fullWeek = buildFullWeek((data as any).weekStartDate ?? startDate, days as PlanDayShape[]);
  const reviewDay = fullWeek[6]; // SUN (index 6) = review day
  const regularDays = fullWeek.slice(0, 7); // MON - SUN

  const allPlanTasks = (days as PlanDayShape[]).flatMap((d) => d.tasks ?? []);
  const weeklyReviewTask = allPlanTasks.find((t) => t.itemType === "weekly_review") ?? null;

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

        {/* ─── MAIN LAYOUT: 3 cols (MON-SAT) + 1 col (SUN + sidebar) ─── */}
        <div className="grid grid-cols-4 items-start gap-3">
          {/* LEFT 3 cols: MON–SAT (6 ngày, grid 3x2) */}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            {regularDays.slice(0, 6).map((planDay) => {
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

          {/* RIGHT col: SUN DayCard + Weekly Review + PlanInsightBanner */}
          <div className="flex flex-col gap-3">
            {/* SUN DayCard */}
            {regularDays[6] &&
              (() => {
                const sunDay = regularDays[6]!;
                const dateObj = new Date(sunDay.date + "T12:00:00");
                const dayLabel = DAY_NAMES[dateObj.getDay()] ?? "SUN";
                const isToday = sunDay.date === todayStr;
                const isPast = sunDay.date < todayStr;
                const tasks = (sunDay.tasks ?? []).filter((t) => t.itemType !== "weekly_review");
                return (
                  <DayCard
                    key={sunDay.date}
                    date={sunDay.date}
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
              })()}

            {/* Weekly Review card */}
            {weeklyReviewTask && (
              <div
                onClick={() => setReviewTask(weeklyReviewTask)}
                className="cursor-pointer rounded-2xl border border-teal-200 bg-teal-50/50 p-4 transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                    Weekly Review
                  </span>
                  {weeklyReviewTask.feedbackSubmittedAt ? (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold text-teal-700">
                      ✓ Done
                    </span>
                  ) : weeklyReviewTask.description ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                      Ready
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-teal-700">
                  {weeklyReviewTask.feedbackSubmittedAt
                    ? "Feedback submitted. Ready for Week 2."
                    : weeklyReviewTask.description
                      ? "Your review is ready — tap to read."
                      : "Complete this week to unlock your review."}
                </p>
              </div>
            )}

            {/* PlanInsightBanner: Let's go + Skill Focus */}
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
