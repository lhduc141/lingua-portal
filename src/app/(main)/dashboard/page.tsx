"use client";

import { useDashboardOverview, useDashboardStreak } from "@/hooks";
import { useCurrentPlan } from "@/hooks/plan";
import { useRouter } from "next/navigation";
import type { PlanTaskDto } from "@/types";
import { HeatmapDay, WEEK_DAYS } from "@/types";
import {
  BarChart2,
  BookMarked,
  CalendarDays,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
} from "lucide-react";
import { ROUTES } from "@/config";
import { cn } from "@/lib";
import { PawSpinner } from "@/components";
import { ActivityItem, HeatCell, SkillBar, StatCard } from "./_components";

function getTodayTasks(days: { date: string; tasks: PlanTaskDto[] }[] | undefined): PlanTaskDto[] {
  if (!days) return [];
  const today = new Date().toISOString().slice(0, 10);
  const todayDay = days.find((d) => d.date === today);
  return (todayDay?.tasks ?? []).filter(
    (t) => t.status === "pending" || t.status === "in_progress"
  );
}

function getTaskRoute(task: PlanTaskDto): string {
  if (task.refType === "lesson" && task.refId) return ROUTES.LEARN.LESSON(task.refId);
  if (task.refType === "question_set" && task.refId)
    return ROUTES.LEARN.PRACTICE_SESSION(task.refId);
  return ROUTES.PLAN;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview();
  const { data: streakData } = useDashboardStreak();
  const { data: planData } = useCurrentPlan();

  const router = useRouter();

  if (isLoading) return <PawSpinner fullScreen />;

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Failed to load dashboard. Please try again.
      </div>
    );
  }

  const {
    cefrLevel,
    planProgress,
    skillSummary,
    streak,
    vocabularyCount,
    recentActivity,
    currentPlanCycle,
  } = data;

  const calendar = streakData?.activityCalendar ?? [];
  const weeks: HeatmapDay[][] = Array.from({ length: 5 }, (_, wi) =>
    Array.from({ length: 7 }, (__, di) => {
      const offset = (4 - wi) * 7 + (6 - di);
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const dateStr = d.toISOString().slice(0, 10);
      return calendar.find((c) => c.date === dateStr) ?? { date: dateStr, totalStudyMinutes: 0 };
    }).reverse()
  );

  const planPct = planProgress?.percentage ?? 0;

  // ── Today's Tasks from plan ──────────────────────────────────────
  const todayTasks = getTodayTasks(planData?.days);

  return (
    <div className="space-y-5">
      <div className="flex gap-4">
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
          iconBg="bg-blue-50"
          label="MY LEVEL"
          value={cefrLevel ?? "—"}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-purple-500" />}
          iconBg="bg-purple-50"
          label="THIS WEEK"
          value={
            planProgress ? (
              <span>
                {planProgress.completedItems}
                <span className="text-[16px] font-bold text-slate-400">
                  /{planProgress.totalItems}
                </span>
              </span>
            ) : (
              "—"
            )
          }
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          iconBg="bg-orange-50"
          label="STREAK"
          value={
            <span>
              {streak.currentDays}{" "}
              <span className="text-[14px] font-bold text-slate-400">Days</span>
            </span>
          }
        />
        <StatCard
          icon={<BookMarked className="h-5 w-5 text-teal-600" />}
          iconBg="bg-teal-100"
          label="LEARNED"
          value={
            <span>
              {vocabularyCount} <span className="text-[14px] font-bold text-slate-400">Words</span>
            </span>
          }
        />
      </div>

      <div className="flex gap-5">
        {/* ── Today's Tasks ─────────────────────────────────────────── */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[24px] text-gray-900">Today&apos;s Tasks</h2>
            <button
              onClick={() => router.push(ROUTES.PLAN)}
              className="text-[14px] font-bold text-[#0f4b42] hover:underline"
            >
              View All
            </button>
          </div>

          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.slice(0, 3).map((task) => (
                <button
                  key={task.itemId}
                  onClick={() => router.push(getTaskRoute(task))}
                  className="flex w-full items-center gap-5 rounded-lg border border-black/50 bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div
                    className={cn(
                      "h-6 w-6 shrink-0 rounded-full border",
                      task.status === "in_progress"
                        ? "border-teal-600 bg-teal-100"
                        : "border-black/30"
                    )}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      {task.skillName && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase",
                            task.skillName === "reading" && "bg-blue-100 text-blue-600",
                            task.skillName === "writing" && "bg-purple-100 text-purple-600",
                            task.skillName === "speaking" && "bg-orange-100 text-orange-600"
                          )}
                        >
                          {task.skillName}
                        </span>
                      )}
                      {task.estimatedMinutes && (
                        <span className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
                          <Clock className="h-3 w-3" /> {task.estimatedMinutes} mins
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-[15px] text-gray-900">{task.title}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-slate-400">
              {planData
                ? "No pending tasks for today 🎉"
                : "Generate a learning plan to get started"}
            </div>
          )}
        </div>

        {/* ── Skills Performance ────────────────────────────────────── */}
        <div className="flex w-[360px] shrink-0 flex-col gap-6 rounded-lg border border-black/50 bg-white px-5 py-5">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-slate-400" />
            <h3 className="font-serif text-[18px] text-gray-900">Skills Performance</h3>
          </div>

          <div className="space-y-5">
            {(["reading", "writing", "speaking"] as const).map((skill) => (
              <SkillBar key={skill} skill={skill} data={skillSummary[skill]} />
            ))}
          </div>

          <button
            onClick={() => router.push(ROUTES.EXERCISE.HISTORY)} // ← fix: ASSESSMENT → EXERCISE
            className="w-full rounded-xl border border-black/50 py-2 text-[14px] text-slate-500 hover:bg-gray-50"
          >
            View Detailed Report
          </button>
        </div>
      </div>

      {/* ── Weekly Plan + Recent Activity ────────────────────────────── */}
      <div className="flex gap-5">
        {/* Weekly Plan */}
        <div className="flex-1 rounded-lg border border-black/50 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-slate-400" />
                <h3 className="font-serif text-[18px] text-gray-900">Weekly Plan</h3>
              </div>
              {currentPlanCycle && (
                <p className="mt-0.5 text-[12px] font-semibold text-slate-500">
                  Learning Plan — Cycle {currentPlanCycle}
                </p>
              )}
            </div>
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-teal-50">
              <span className="text-[14px] font-bold text-[#188c7d]">{planPct.toFixed(0)}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="relative h-3 w-full rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-3 rounded-full bg-[#157868] transition-all duration-500"
                style={{ width: `${planPct}%` }}
              />
              <div
                className="absolute top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full border-2 border-[#157868] bg-white shadow"
                style={{ left: `calc(${planPct}% - 11px)` }}
              />
            </div>
            <div className="flex justify-between">
              {WEEK_DAYS.map((d) => (
                <span key={d} className="text-[11px] font-semibold text-slate-400">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push(ROUTES.PLAN)}
            className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-[#0f4b42] hover:underline"
          >
            Go to full plan <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex w-[360px] shrink-0 flex-col gap-3">
          <h3 className="font-serif text-[18px] text-gray-900">Recent Activity</h3>
          <div className="flex flex-col gap-4 rounded-lg border border-black/50 bg-white p-4">
            {recentActivity.length > 0 ? (
              recentActivity
                .slice(0, 3)
                .map((item) => (
                  <ActivityItem
                    key={`activity-${item.type}-${item.date}-${item.title}`}
                    item={item}
                  />
                ))
            ) : (
              <p className="text-sm text-slate-400">No activity yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-black/50 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-slate-400" />
            <h3 className="font-serif text-[18px] text-gray-900">Study Consistency</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
            <span>Less</span>
            {(["bg-[#e6f7f4]", "bg-[#c3ede6]", "bg-[#90dbce]", "bg-[#157868]"] as const).map(
              (c, i) => (
                <div key={i} className={cn("h-3 w-3 rounded-sm", c)} />
              )
            )}
            <span>More</span>
          </div>
        </div>

        <div className="space-y-2">
          {weeks.map((week, wi) => (
            <div key={`week-${wi}`} className="flex gap-2">
              {week.map((day) => (
                <HeatCell key={day.date} day={day} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
