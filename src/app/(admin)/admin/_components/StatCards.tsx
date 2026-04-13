import { Users, Activity, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib";
import type { AdminStatsDto } from "@/types/dto/admin";

interface StatCardsProps {
  stats: AdminStatsDto;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      label: "TOTAL USERS",
      value: stats.users.total,
      sub: `${stats.users.active} active · ${stats.users.newThisWeek} new this week`,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "EXERCISES THIS WEEK",
      value: stats.activity.exerciseRecordsThisWeek,
      sub: `${stats.activity.pendingGrading} pending AI grading`,
      icon: Activity,
      iconBg: stats.activity.pendingGrading > 0 ? "bg-amber-50" : "bg-teal-50",
      iconColor: stats.activity.pendingGrading > 0 ? "text-amber-500" : "text-teal-600",
    },
    {
      label: "TOTAL LESSONS",
      value: stats.content.lessons,
      sub: `${stats.content.questionSets} practice sets · ${stats.content.questions} questions`,
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "DICTIONARY",
      value: stats.content.dictionaryEntries,
      sub: `${stats.content.passages} passages`,
      icon: Loader2,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              c.iconBg
            )}
          >
            <c.icon className={cn("h-5 w-5", c.iconColor)} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {c.label}
            </p>
            <p className="font-serif text-[28px] font-bold leading-tight text-gray-900">
              {c.value}
            </p>
            <p className="text-[11px] text-slate-400">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
