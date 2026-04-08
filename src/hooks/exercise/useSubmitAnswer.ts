"use client";

import { useMutation } from "@tanstack/react-query";
import { submitExerciseAnswer } from "@/services/learn";
import type { SubmitExerciseAnswerDto } from "@/types/dto/exercise";

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({ exerciseId, dto }: { exerciseId: string; dto: SubmitExerciseAnswerDto }) =>
      submitExerciseAnswer(exerciseId, dto),
  });
}
