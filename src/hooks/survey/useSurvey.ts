"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSurvey, updateSurvey } from "@/services/survey";
import type { SurveyFormData } from "@/types";

export function useSurvey() {
  return useQuery({
    queryKey: ["survey"],
    queryFn: getSurvey,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SurveyFormData) => updateSurvey(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["survey"] });
    },
  });
}
