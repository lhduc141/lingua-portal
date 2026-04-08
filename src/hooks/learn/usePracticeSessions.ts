"use client";

import { useQuery } from "@tanstack/react-query";
import { getPracticeSessions, type LearnListParams } from "@/services/learn";
import type { QuestionSetListItemDto } from "@/types/dto/learn";

export function usePracticeSessions(params?: LearnListParams) {
  return useQuery({
    queryKey: ["practice-sessions", params],
    queryFn: async () => {
      const res = await getPracticeSessions(params);
      return res.data as { rows: QuestionSetListItemDto[]; count: number };
    },
    staleTime: 5 * 60 * 1000,
  });
}
