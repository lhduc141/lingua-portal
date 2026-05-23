import { cn } from "@/lib";
import type { SkillSummaryItem } from "@/types";
import { SKILL_CONFIG, TREND_CONFIG } from "@/types/constants/dashboard.constant";

interface SkillSummarySectionProps {
  skillSummary: Record<string, SkillSummaryItem>;
}

const SKILL_ICONS: Record<string, string> = {
  reading: "bg-teal-50",
  writing: "bg-violet-50",
  speaking: "bg-orange-50",
  listening: "bg-emerald-50",
};

export function SkillSummarySection({ skillSummary }: SkillSummarySectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 font-serif text-[20px] text-gray-900">Skills Performance</h3>
      <div className="space-y-5">
        {(["reading", "writing", "speaking"/*, "listening"*/] as const).map((skill) => {
          const data = skillSummary[skill];
          const cfg = SKILL_CONFIG[skill];
          const trend = TREND_CONFIG[data?.trend ?? "new"];
          const pct =
            data?.avgScore !== null && data?.avgScore !== undefined
              ? Math.min(100, Math.round(data.avgScore))
              : null;

          return (
            <div key={skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn("h-3 w-3 rounded-full", SKILL_ICONS[skill])}
                    style={{ backgroundColor: cfg.bar }}
                  />
                  <span className="text-[15px] font-medium text-gray-800">{cfg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {pct !== null && (
                    <span className="text-[13px] font-semibold text-gray-700">{pct}%</span>
                  )}
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] font-medium",
                      trend.bg,
                      trend.text
                    )}
                  >
                    {pct !== null ? trend.symbol : "No data"}
                  </span>
                </div>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="absolute left-0 top-0 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${pct ?? 0}%`, backgroundColor: cfg.bar }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
