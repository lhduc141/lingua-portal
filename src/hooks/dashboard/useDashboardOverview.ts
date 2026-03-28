import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview, getDashboardStreak } from "@/services";
import { DashboardOverviewDto, StreakDto } from "@/types";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const res = await getDashboardOverview();
      return res.data as DashboardOverviewDto;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDashboardStreak() {
  return useQuery({
    queryKey: ["dashboard", "streak"],
    queryFn: async () => {
      const res = await getDashboardStreak();
      return res.data as StreakDto;
    },
    staleTime: 5 * 60 * 1000,
  });
}
