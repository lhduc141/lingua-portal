"use client";

import { cn } from "@/lib/cn";
import { Flame } from "lucide-react";
import { SKILL_CONFIG } from "@/types/constants/dashboard.constant";

interface SkillItem {
  avgScore?: number | null;
  trend?: string;
}

interface PlanInsightBannerProps {
  userName: string;
  streak: number;
  skillSummary: Record<string, SkillItem>;
  planProgress: number;
}

const TREND_LABEL: Record<string, { symbol: string; color: string }> = {
  up: { symbol: "↑", color: "text-teal-600" },
  down: { symbol: "↓", color: "text-red-400" },
  stable: { symbol: "→", color: "text-slate-400" },
  new: { symbol: "New", color: "text-slate-400" },
};

function getMessage(progress: number, streak: number, name: string) {
  if (progress >= 80) return `Outstanding, ${name}! You're crushing this week.`;
  if (progress >= 50) return `Great job, ${name}! Over halfway there.`;
  if (streak > 7) return `${streak} days strong, ${name}! Keep it up.`;
  return `Let's go, ${name}! Start today's tasks.`;
}

export function PlanInsightBanner({
  userName,
  streak,
  skillSummary,
  planProgress,
}: PlanInsightBannerProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Motivational card */}
      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-4 text-white">
        <p className="font-serif text-[15px] font-semibold leading-snug">
          {getMessage(planProgress, streak, userName)}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-300" />
            <span className="font-serif text-[20px] font-bold">{streak}</span>
            <span className="text-[10px] text-white/60">days</span>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <span className="font-serif text-[20px] font-bold">{planProgress.toFixed(0)}</span>
            <span className="text-[10px] text-white/60">% this week</span>
          </div>
        </div>
      </div>

      {/* Skill focus */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-[13px] font-bold text-gray-700">Skill Focus</h3>
        <div className="space-y-3">
          {(["reading", "writing", "speaking"] as const).map((skill) => {
            const data = skillSummary[skill];
            const cfg = SKILL_CONFIG[skill];
            const trendKey = data?.trend ?? "new";
            const trend = TREND_LABEL[trendKey] ?? { symbol: "New", color: "text-slate-400" };
            const pct =
              data?.avgScore != null ? Math.min(100, Math.round(Number(data.avgScore))) : 0;

            return (
              <div key={skill}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-medium capitalize text-gray-700">{skill}</span>
                  <span className={cn("text-[11px] font-semibold", trend.color)}>
                    {pct > 0 ? `${trend.symbol}${pct}%` : trend.symbol}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: cfg.bar }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
