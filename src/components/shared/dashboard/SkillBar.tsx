import { SKILL_CONFIG, SkillSummaryItem, TREND_CONFIG } from "@/types";
import { cn } from "@/lib";

interface SkillBarProps {
  skill: keyof typeof SKILL_CONFIG;
  data: SkillSummaryItem;
}

export function SkillBar({ skill, data }: SkillBarProps) {
  const cfg = SKILL_CONFIG[skill];
  const trend = TREND_CONFIG[data.trend];
  const pct = data.avgScore !== null ? Math.min(100, Math.round(data.avgScore)) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-gray-900">{cfg.label}</span>
        <span className={cn("rounded-md px-1.5 py-0.5 text-[11px]", trend.bg, trend.text)}>
          {data.avgScore !== null ? `${pct}% ${trend.symbol}` : trend.symbol}
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: cfg.bar }}
        />
      </div>
    </div>
  );
}
