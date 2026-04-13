import { Flame, BookMarked, CalendarDays } from "lucide-react";
import { cn } from "@/lib";

interface StatsRowProps {
  streak: number;
  vocabularyCount: number;
  planCompleted: number;
  planTotal: number;
}

const STATS = (p: StatsRowProps) => [
  {
    icon: Flame,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    label: "STUDY STREAK",
    value: `${p.streak}`,
    unit: "days",
  },
  {
    icon: BookMarked,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    label: "VOCABULARY",
    value: `${p.vocabularyCount}`,
    unit: "words saved",
  },
  {
    icon: CalendarDays,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    label: "WEEKLY PLAN",
    value: `${p.planCompleted}/${p.planTotal}`,
    unit: "tasks done",
  },
];

export function StatsRow(props: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STATS(props).map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              s.iconBg
            )}
          >
            <s.icon className={cn("h-5 w-5", s.iconColor)} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {s.label}
            </p>
            <p className="font-serif text-[26px] font-bold leading-tight text-gray-900">
              {s.value}
            </p>
            <p className="text-[11px] text-slate-400">{s.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
