import { cn } from "@/lib";

const SKILL_CONFIG = {
  reading: { label: "Reading", bar: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50" },
  writing: { label: "Writing", bar: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50" },
  speaking: {
    label: "Speaking",
    bar: "bg-orange-500",
    text: "text-orange-700",
    bg: "bg-orange-50",
  },
} as const;

interface SkillPerformanceProps {
  skillPerformance: Record<string, { avgScore: number | null; count: number }>;
}

export function SkillPerformance({ skillPerformance }: SkillPerformanceProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 font-serif text-[18px] text-gray-900">Skill Performance</h3>
      <p className="mb-5 text-[12px] text-slate-400">Average score across all scored exercises</p>
      <div className="space-y-5">
        {(["reading", "writing", "speaking", "listening"] as const).map((skill) => {
          const data = skillPerformance[skill];
          const cfg = SKILL_CONFIG[skill];
          const avg = data?.avgScore ?? null;
          const pct = avg !== null ? Math.min(100, Math.round(avg)) : 0;
          return (
            <div key={skill} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn("rounded px-2 py-0.5 text-[11px] font-bold", cfg.bg, cfg.text)}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[12px] text-slate-400">{data?.count ?? 0} attempts</span>
                </div>
                <span className="text-[15px] font-bold text-gray-800">
                  {avg !== null ? `${avg}%` : "—"}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", cfg.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
