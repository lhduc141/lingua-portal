"use client";

import { useQuery } from "@tanstack/react-query";
import { getExerciseHistory } from "@/services/learn";

export function useExerciseHistory(params?: { pageIndex?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["exercise", "history", params],
    queryFn: () => getExerciseHistory(params ?? {}),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
