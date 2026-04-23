"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Mic,
  PenLine,
  SkipForward,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib";
import { ROUTES } from "@/config";
import { PawSpinner } from "@/components";
import { usePlanHistory } from "@/hooks/plan";

const SKILL_CFG = {
  reading: { icon: <BookOpen className="h-3 w-3" />, color: "text-blue-600 bg-blue-50" },
  writing: { icon: <PenLine className="h-3 w-3" />, color: "text-violet-600 bg-violet-50" },
  speaking: { icon: <Mic className="h-3 w-3" />, color: "text-orange-500 bg-orange-50" },
} as const;

function PerformanceBadge({ pct }: { pct: number }) {
  if (pct >= 90)
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1">
        <Trophy className="h-3.5 w-3.5 text-teal-600" />
        <span className="text-[13px] font-bold text-teal-700">{pct.toFixed(0)}%</span>
      </div>
    );
  if (pct >= 70)
    return (
      <span className="rounded-lg bg-teal-50 px-3 py-1 text-[13px] font-bold text-teal-700">
        {pct.toFixed(0)}%
      </span>
    );
  return (
    <span className="rounded-lg bg-amber-50 px-3 py-1 text-[13px] font-bold text-amber-700">
      {pct.toFixed(0)}%
    </span>
  );
}

export default function PlanHistoryPage() {
  const router = useRouter();
  const { data, isLoading } = usePlanHistory({ pageIndex: 1, pageSize: 20 });
  const rows = data?.rows ?? [];

  if (isLoading) return <PawSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push(ROUTES.PLAN)}
        className="flex items-center gap-2 text-[14px] font-medium text-slate-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plan
      </button>

      <div>
        <h1 className="font-serif text-[32px] text-gray-900">Plan History</h1>
        <p className="mt-1 text-[14px] text-slate-500">Your past learning cycles</p>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">
          <CalendarDays className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-[14px] font-medium text-slate-500">No plan history yet</p>
          <p className="mt-1 text-[13px] text-slate-400">
            Complete a week to see your history here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((item: any) => {
            const pct = item.progress ?? 0;
            const isGood = pct >= 70;
            const skillBreakdown: Record<string, number> = item.skillBreakdown ?? {};

            return (
              <div
                key={`${item.planCycle}-${item.weekNumber}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-serif text-[20px] text-gray-900">
                      Cycle {item.planCycle} — Week {item.weekNumber}
                    </p>
                    <p className="mt-0.5 text-[12px] text-slate-400">
                      {new Date(item.startDate + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" – "}
                      {new Date(item.endDate + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <PerformanceBadge pct={pct} />
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isGood ? "bg-teal-500" : "bg-amber-400"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Stats row */}
                <div className="mt-3 flex items-center gap-5 text-[12px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                    {item.completedTasks} completed
                  </span>
                  <span className="flex items-center gap-1">
                    <SkipForward className="h-3.5 w-3.5 text-slate-300" />
                    {item.skippedTasks} skipped
                  </span>
                  <span className="text-slate-400">{item.totalTasks} total</span>

                  {/* Skill breakdown — nếu có data */}
                  {Object.keys(skillBreakdown).length > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                      {(Object.entries(skillBreakdown) as [keyof typeof SKILL_CFG, number][]).map(
                        ([skill, count]) => {
                          const cfg = SKILL_CFG[skill];
                          if (!cfg || count === 0) return null;
                          return (
                            <span
                              key={skill}
                              className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                cfg.color
                              )}
                            >
                              {cfg.icon} {count}
                            </span>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
