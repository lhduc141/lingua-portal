"use client";

import { useQuery } from "@tanstack/react-query";
import { getExerciseResult } from "@/services/learn";

export function useExerciseResult(exerciseId: string | null) {
  return useQuery({
    queryKey: ["exercise", exerciseId, "result"],
    queryFn: () => getExerciseResult(exerciseId!),
    enabled: !!exerciseId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === "scored" ? false : 5000;
    },
    refetchOnWindowFocus: false,
  });
}
