"use client";

import { useMutation } from "@tanstack/react-query";
import { completeExercise } from "@/services/learn";

export function useCompleteExercise() {
  return useMutation({
    mutationFn: (exerciseId: string) => completeExercise(exerciseId),
  });
}
