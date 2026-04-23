import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generatePlan,
  getCurrentPlan,
  getPlanHistory,
  submitReviewFeedback,
  updatePlanItem,
} from "@/services";
import { ReviewFeedbackDto, UpdatePlanItemDto } from "@/types";

export function useCurrentPlan() {
  return useQuery({
    queryKey: ["plan", "current"],
    queryFn: async () => {
      const res = await getCurrentPlan();
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useGeneratePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phase?: "week1" | "week2") => generatePlan(phase),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
    },
  });
}

export function useUpdatePlanItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, dto }: { itemId: string; dto: UpdatePlanItemDto }) =>
      updatePlanItem(itemId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
    },
  });
}

export function useSubmitReviewFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, dto }: { itemId: string; dto: ReviewFeedbackDto }) =>
      submitReviewFeedback(itemId, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["plan", "current"] });
      void queryClient.invalidateQueries({ queryKey: ["plan", "history"] });
    },
  });
}

export function usePlanHistory(params?: { pageIndex?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["plan", "history", params],
    queryFn: async () => {
      const res = await getPlanHistory(params);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}