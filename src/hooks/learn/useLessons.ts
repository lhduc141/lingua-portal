"use client";

import { useQuery } from "@tanstack/react-query";
import { getLessons, type LearnListParams } from "@/services/learn";
import type { LessonListItemDto } from "@/types/dto/learn";

export function useLessons(params?: LearnListParams) {
  return useQuery({
    queryKey: ["lessons", params],
    queryFn: async () => {
      const res = await getLessons(params);
      return res.data as { rows: LessonListItemDto[]; count: number };
    },
    staleTime: 5 * 60 * 1000,
  });
}
