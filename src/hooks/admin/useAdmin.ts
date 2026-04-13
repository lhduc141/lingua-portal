"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminPlacementSessions,
  getAdminStats,
  getAdminUsers,
  updateLessonStatus,
} from "@/services/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await getAdminStats();
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminUsers(params?: { search?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const res = await getAdminUsers(params);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminPlacementSessions(params?: {
  pageIndex?: number;
  pageSize?: number;
  cefrLevel?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["admin", "placement-sessions", params],
    queryFn: async () => {
      const res = await getAdminPlacementSessions(params);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateLessonStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, status }: { lessonId: string; status: "published" | "draft" }) =>
      updateLessonStatus(lessonId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
