import { cn } from "@/lib";

const CEFR_CONFIG: Record<string, { label: string; bg: string; bar: string; text: string }> = {
  A1: { label: "A1 Beginner", bg: "bg-gray-100", bar: "bg-gray-400", text: "text-gray-600" },
  A2: { label: "A2 Elementary", bg: "bg-green-50", bar: "bg-green-500", text: "text-green-700" },
  B1: { label: "B1 Intermediate", bg: "bg-teal-50", bar: "bg-teal-500", text: "text-teal-700" },
  B2: { label: "B2 Upper-Int", bg: "bg-blue-50", bar: "bg-blue-500", text: "text-blue-700" },
  C1: { label: "C1 Advanced", bg: "bg-purple-50", bar: "bg-purple-500", text: "text-purple-700" },
};

interface CefrDistributionProps {
  distribution: Record<string, number>;
  totalUsers: number;
}

export function CefrDistribution({ distribution, totalUsers }: CefrDistributionProps) {
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const max = Math.max(...levels.map((l) => distribution[l] ?? 0), 1);
  const notAssessed = totalUsers - levels.reduce((s, l) => s + (distribution[l] ?? 0), 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 font-serif text-[18px] text-gray-900">CEFR Distribution</h3>
      <p className="mb-5 text-[12px] text-slate-400">
        Validates CAT engine accuracy — should be spread across levels
      </p>
      <div className="space-y-3">
        {levels.map((level) => {
          const count = distribution[level] ?? 0;
          const pct = max > 0 ? Math.round((count / max) * 100) : 0;
          const cfg = CEFR_CONFIG[level];

          if (!cfg) return null;

          return (
            <div key={level} className="flex items-center gap-3">
              <span
                className={cn(
                  "w-24 shrink-0 rounded-md px-2 py-1 text-center text-[11px] font-bold",
                  cfg.bg,
                  cfg.text
                )}
              >
                {cfg.label}
              </span>
              <div
                className="flex-1 overflow-hidden rounded-full bg-gray-100"
                style={{ height: 8 }}
              >
                <div
                  className={cn("h-full rounded-full transition-all duration-700", cfg.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[13px] font-semibold text-gray-700">
                {count}
              </span>
            </div>
          );
        })}
        {notAssessed > 0 && (
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 rounded-md bg-gray-50 px-2 py-1 text-center text-[11px] font-bold text-gray-400">
              No Level
            </span>
            <div className="flex-1 overflow-hidden rounded-full bg-gray-100" style={{ height: 8 }}>
              <div
                className="h-full rounded-full bg-gray-300 transition-all duration-700"
                style={{ width: `${Math.round((notAssessed / max) * 100)}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-[13px] font-semibold text-gray-400">
              {notAssessed}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
