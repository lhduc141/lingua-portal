import { BookOpen, TrendingUp, Trophy } from "lucide-react";
import type { ExerciseHistoryItemDto } from "@/types";
import { cn } from "@/lib";

interface HistoryStatsBarProps {
  items: ExerciseHistoryItemDto[];
}

export function HistoryStatsBar({ items }: HistoryStatsBarProps) {
  const scored = items.filter((i) => i.score !== null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((s, i) => s + (i.score ?? 0), 0) / scored.length)
    : null;
  const bestScore = scored.length > 0
    ? Math.max(...scored.map((i) => i.score ?? 0))
    : null;

  const stats = [
    {
      label: "TOTAL ATTEMPTS",
      value: `${items.length}`,
      sub: "exercises done",
      icon: BookOpen,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "AVERAGE SCORE",
      value: avgScore !== null ? `${avgScore}%` : "—",
      sub: avgScore !== null
        ? avgScore >= 80 ? "Excellent progress"
          : avgScore >= 60 ? "Steady progress"
            : "Keep practicing"
        : "No scored yet",
      icon: TrendingUp,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      valueColor: avgScore !== null
        ? avgScore >= 80 ? "text-green-600"
          : avgScore >= 60 ? "text-amber-500"
            : "text-red-500"
        : "text-gray-400",
    },
    {
      label: "BEST SCORE",
      value: bestScore !== null ? `${bestScore}%` : "—",
      sub: bestScore !== null ? "Personal best" : "No scored yet",
      icon: Trophy,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
      valueColor: "text-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", s.iconBg)}>
            <s.icon className={cn("h-5 w-5", s.iconColor)} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className={cn("font-serif text-[26px] font-bold leading-tight", s.valueColor ?? "text-gray-900")}>
              {s.value}
            </p>
            <p className="text-[11px] text-slate-400">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}