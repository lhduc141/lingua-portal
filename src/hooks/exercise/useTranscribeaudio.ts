import { useMutation } from "@tanstack/react-query";
import { transcribeAudio } from "@/services/learn";

export function useTranscribeAudio() {
  return useMutation({
    mutationFn: (audioBlob: Blob) => transcribeAudio(audioBlob),
  });
}
