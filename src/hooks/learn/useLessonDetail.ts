"use client";

import { useQuery } from "@tanstack/react-query";
import { getLessonById } from "@/services/learn";
import type { LessonDetailDto } from "@/types/dto/learn";

export function useLessonDetail(lessonId: string) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const res = await getLessonById(lessonId);
      return res.data as LessonDetailDto;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!lessonId,
  });
}
