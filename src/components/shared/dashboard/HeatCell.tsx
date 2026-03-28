import { cn } from "@/lib";
import { HeatmapDay } from "@/types";

interface HeatCellProps {
  day: HeatmapDay;
}

export function HeatCell({ day }: HeatCellProps) {
  const m = day.totalStudyMinutes;
  const color =
    m === 0
      ? "bg-gray-100"
      : m < 15
        ? "bg-[#e6f7f4]"
        : m < 30
          ? "bg-[#c3ede6]"
          : m < 60
            ? "bg-[#90dbce]"
            : "bg-[#157868]";

  return <div title={`${day.date}: ${m} min`} className={cn("h-9 flex-1 rounded-sm", color)} />;
}
