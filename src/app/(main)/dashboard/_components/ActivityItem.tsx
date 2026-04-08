import { CheckCircle2, PlusCircle } from "lucide-react";
import { RecentActivityItem } from "@/types";
import { cn } from "@/lib";

interface ActivityItemProps {
  item: RecentActivityItem;
}

export function ActivityItem({ item }: ActivityItemProps) {
  const cfg = {
    assessment: { bg: "bg-teal-50", icon: <CheckCircle2 className="h-4 w-4 text-teal-600" /> },
    plan_item: { bg: "bg-blue-50", icon: <PlusCircle className="h-4 w-4 text-blue-500" /> },
  };
  const { bg, icon } = cfg[item.type] ?? cfg.plan_item;

  const formatDate = (d: string) => {
    const diffH = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH} hours ago`;
    if (diffH < 48) return "Yesterday";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex items-start gap-3">
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", bg)}>
        {icon}
      </div>
      <div>
        <p className="text-[13px] text-gray-900">{item.title}</p>
        <p className="text-[11px] text-slate-400">{formatDate(item.date)}</p>
      </div>
    </div>
  );
}
