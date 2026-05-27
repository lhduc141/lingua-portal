"use client";

import { useMutation } from "@tanstack/react-query";
import { submitSpeakingAnswer } from "@/services/learn";

export function useSubmitSpeakingAnswer() {
  return useMutation({
    mutationFn: ({
      exerciseId,
      questionId,
      audioBlob,
    }: {
      exerciseId: string;
      questionId: string;
      audioBlob: Blob;
    }) => submitSpeakingAnswer(exerciseId, questionId, audioBlob),
  });
}
