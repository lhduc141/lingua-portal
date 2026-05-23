"use client";

import { useRouter } from "next/navigation";
import {
  BarChart2,
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Headphones,
  Lightbulb,
  Mic,
  PenLine,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib";
import { ROUTES } from "@/config";
import { useDashboardOverview, useDashboardStreak } from "@/hooks/dashboard";
import { useCurrentPlan } from "@/hooks/plan";
import { useVocabularyList } from "@/hooks/dictionary";
import { PawSpinner } from "@/components";
import { HeatCell, SkillBar, StatCard } from "./_components";
import type { HeatmapDay, PlanTaskDto } from "@/types";

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const SKILL_ICON = {
  reading: <BookOpen className="h-3.5 w-3.5" />,
  writing: <PenLine className="h-3.5 w-3.5" />,
  speaking: <Mic className="h-3.5 w-3.5" />,
  // listening: <Headphones className="h-3.5 w-3.5" />,
};

const SKILL_COLOR = {
  reading: "text-blue-600 bg-blue-50",
  writing: "text-violet-600 bg-violet-50",
  speaking: "text-orange-500 bg-orange-50",
  // listening: "text-emerald-600 bg-emerald-50",
};

function toLocalDateStr(date = new Date()): string {
  const vn = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  return `${vn.getFullYear()}-${String(vn.getMonth() + 1).padStart(2, "0")}-${String(vn.getDate()).padStart(2, "0")}`;
}

function getTodayTasks(days: { date: string; tasks: PlanTaskDto[] }[] | undefined): PlanTaskDto[] {
  if (!days) return [];
  const today = toLocalDateStr();
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

function getAiTip(
  skillSummary: Record<string, { avgScore: number | null; trend: string }>
): string {
  const entries = Object.entries(skillSummary).filter(([, v]) => v.avgScore !== null);
  if (entries.length === 0) return "Complete your first exercise to get personalized tips!";
  const weakest = entries.sort(([, a], [, b]) => (a.avgScore ?? 0) - (b.avgScore ?? 0))[0];
  if (!weakest) return "Keep up the great work!";
  const [skill, data] = weakest;
  const score = Math.round(data.avgScore ?? 0);
  if (score < 50)
    return `Your ${skill} is at ${score}% — try 1 ${skill} practice today to improve.`;
  if (score < 75)
    return `${skill.charAt(0).toUpperCase() + skill.slice(1)} at ${score}% — you're making progress! Keep going.`;
  return `Great ${skill} score at ${score}%! Try challenging yourself with harder exercises.`;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview();
  const { data: streakData } = useDashboardStreak();
  const { data: planData } = useCurrentPlan();
  const { data: vocabData, isLoading: vocabLoading } = useVocabularyList({
    pageIndex: 1,
    pageSize: 5,
  });
  const router = useRouter();

  if (isLoading) return <PawSpinner fullScreen />;
  if (error || !data)
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Failed to load dashboard. Please try again.
      </div>
    );

  const {
    cefrLevel,
    planProgress,
    skillSummary,
    streak,
    vocabularyCount,
    recentActivity,
    currentPlanCycle,
    totalAssessments,
    lessonsCompleted,
    practiceCompleted,
  } = data;

  // Heatmap
  const calendar = streakData?.activityCalendar ?? [];
  const weeks: HeatmapDay[][] = Array.from({ length: 5 }, (_, wi) =>
    Array.from({ length: 7 }, (__, di) => {
      const offset = (4 - wi) * 7 + (6 - di);
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const dateStr = toLocalDateStr(d);
      return (
        calendar.find((c) => c.date === dateStr) ?? { date: dateStr, totalStudyMinutes: 0 }
      );
    }).reverse()
  );

  const planPct = planProgress?.percentage ?? 0;
  const todayTasks = getTodayTasks(planData?.days);
  const recentVocab = vocabData?.data?.rows ?? [];
  const aiTip = getAiTip(skillSummary ?? {});

  return (
    <div className="space-y-5">
      {/* ── Row 1: 6 Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-6 gap-3">
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-blue-300" />}
          iconBg="bg-blue-50"
          label="MY LEVEL"
          value={cefrLevel ?? "—"}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-purple-300" />}
          iconBg="bg-purple-50"
          label="THIS WEEK"
          value={
            planProgress ? (
              <span>
                {planProgress.completedItems}
                <span className="text-[14px] font-bold text-slate-400">
                  /{planProgress.totalItems}
                </span>
              </span>
            ) : (
              "—"
            )
          }
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-300" />}
          iconBg="bg-orange-50"
          label="STREAK"
          value={
            <span>
              {streak?.currentDays ?? 0}
              <span className="text-[14px] font-bold text-slate-400"> Days</span>
            </span>
          }
        />
        <StatCard
          icon={<BookMarked className="h-5 w-5 text-teal-400" />}
          iconBg="bg-teal-100"
          label="VOCAB"
          value={
            <span>
              {vocabularyCount ?? 0}
              <span className="text-[14px] font-bold text-slate-400"> Words</span>
            </span>
          }
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-indigo-300" />}
          iconBg="bg-indigo-50"
          label="LESSONS"
          value={
            <span>
              {lessonsCompleted ?? 0}
              <span className="text-[14px] font-bold text-slate-400"> Done</span>
            </span>
          }
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-amber-300" />}
          iconBg="bg-amber-50"
          label="EXERCISES"
          value={
            <span>
              {totalAssessments ?? 0}
              <span className="text-[14px] font-bold text-slate-400"> Total</span>
            </span>
          }
        />
      </div>

      {/* ── Row 2: Tasks | Skills | Vocab ───────────────────────── */}
      <div className="grid grid-cols-3 gap-5">
        {/* Today's Tasks */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[20px] text-gray-900">Today&apos;s Tasks</h2>
            <button
              onClick={() => router.push(ROUTES.PLAN)}
              className="text-[13px] font-bold text-teal-700 hover:underline"
            >
              View All
            </button>
          </div>
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.slice(0, 4).map((task) => (
                <button
                  key={task.itemId}
                  onClick={() => router.push(getTaskRoute(task))}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div
                    className={cn(
                      "h-5 w-5 shrink-0 rounded-full border-2",
                      task.status === "in_progress"
                        ? "border-teal-600 bg-teal-100"
                        : "border-gray-300"
                    )}
                  />
                  <div className="min-w-0">
                    <div className="mb-0.5 flex items-center gap-2">
                      {task.skillName && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase",
                            task.skillName === "reading" && "bg-blue-100 text-blue-600",
                            task.skillName === "writing" && "bg-purple-100 text-purple-600",
                            task.skillName === "speaking" && "bg-orange-100 text-orange-600",
                            // task.skillName === "listening" && "bg-emerald-100 text-emerald-600"
                          )}
                        >
                          {task.skillName}
                        </span>
                      )}
                      {task.estimatedMinutes && (
                        <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
                          <Clock className="h-2.5 w-2.5" />
                          {task.estimatedMinutes}m
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[13px] font-medium text-gray-900">{task.title}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
              <p className="text-[13px] text-slate-400">
                {planData ? "All done for today! 🎉" : "Generate a plan to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Skills Performance */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-slate-400" />
            <h3 className="font-serif text-[18px] text-gray-900">Skills Performance</h3>
          </div>
          <div className="flex-1 space-y-4">
            {(["reading", "writing", "speaking"/*, "listening"*/] as const).map((skill) => (
              <SkillBar key={skill} skill={skill} data={skillSummary[skill]} />
            ))}
          </div>
          <button
            onClick={() => router.push(ROUTES.EXERCISE.HISTORY)}
            className="w-full rounded-xl border border-gray-200 py-2 text-[13px] text-slate-500 hover:bg-gray-50"
          >
            View Detailed Report
          </button>
        </div>

        {/* Recent Vocabulary */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-slate-400" />
              <h3 className="font-serif text-[18px] text-gray-900">My Vocabulary</h3>
            </div>
            <button
              onClick={() => router.push(ROUTES.VOCABULARY)}
              className="text-[13px] font-bold text-teal-700 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
            {recentVocab.length > 0 ? (
              recentVocab.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 border-b border-gray-50 py-1.5 last:border-0"
                >
                  <div>
                    <span className="text-[14px] font-semibold text-gray-900">
                      {item.entry.headword}
                    </span>
                    {item.entry.pos && (
                      <span className="ml-1.5 text-[10px] italic text-slate-400">
                        {item.entry.pos}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {item.entry.cefrLevel && (
                      <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[9px] font-bold text-teal-600">
                        {item.entry.cefrLevel}
                      </span>
                    )}
                    {item.entry.ipa && (
                      <span className="text-[10px] text-slate-400">/{item.entry.ipa}/</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-[13px] text-slate-400">
                {vocabLoading ? "Loading..." : "No saved words yet"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: Left (Plan + Heatmap) | Right (Activity + Tip) ── */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: Weekly Plan + Study Consistency */}
        <div className="col-span-2 space-y-4">
          {/* Weekly Plan */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <h3 className="font-serif text-[18px] text-gray-900">Weekly Plan</h3>
                </div>
                {currentPlanCycle && (
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                    Learning Plan — Cycle {currentPlanCycle}
                  </p>
                )}
              </div>
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-teal-50">
                <span className="text-[13px] font-bold text-teal-700">{planPct.toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative h-3 w-full rounded-full bg-gray-200">
                <div
                  className="absolute left-0 top-0 h-3 rounded-full bg-teal-600 transition-all duration-500"
                  style={{ width: `${planPct}%` }}
                />
                <div
                  className="absolute top-1/2 h-[20px] w-[20px] -translate-y-1/2 rounded-full border-2 border-teal-600 bg-white shadow"
                  style={{ left: `calc(${planPct}% - 10px)` }}
                />
              </div>
              <div className="flex justify-between">
                {WEEK_DAYS.map((d) => (
                  <span key={d} className="text-[10px] font-semibold text-slate-400">
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push(ROUTES.PLAN)}
              className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-teal-700 hover:underline"
            >
              Go to full plan <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Study Consistency */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <h3 className="font-serif text-[18px] text-gray-900">Study Consistency</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
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

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-serif text-[18px] text-gray-900">Recent Activity</h3>
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
              {recentActivity?.length > 0 ? (
                recentActivity.slice(0, 5).map((item, index) => (
                  <div
                    key={`activity-${index}`}
                    className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px]",
                        item.skillName
                          ? SKILL_COLOR[item.skillName as keyof typeof SKILL_COLOR]
                          : "bg-teal-50 text-teal-600"
                      )}
                    >
                      {item.skillName ? (
                        SKILL_ICON[item.skillName as keyof typeof SKILL_ICON]
                      ) : (
                        <BookOpen className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-gray-900">{item.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.skillName && `${item.skillName} · `}
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {item.score !== null && item.score !== undefined && (
                      <span
                        className={cn(
                          "shrink-0 text-[12px] font-bold",
                          item.score >= 80
                            ? "text-teal-600"
                            : item.score >= 60
                              ? "text-amber-500"
                              : "text-red-400"
                        )}
                      >
                        {Math.round(item.score)}%
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-400">No activity yet</p>
              )}
            </div>
          </div>

          {/* AI Tip */}
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600">
                <Lightbulb className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-[12px] font-bold uppercase tracking-wide text-teal-700">AI Tip</p>
            </div>
            <p className="text-[13px] leading-relaxed text-teal-800">{aiTip}</p>
          </div>

          {/* Streak info */}
          {streak && streak.longestDays > 1 && (
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <p className="text-[13px] font-semibold text-orange-700">Longest Streak</p>
                </div>
                <span className="text-[18px] font-bold text-orange-600">
                  {streak.longestDays} days
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}