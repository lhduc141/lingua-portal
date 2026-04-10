"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteVocabulary,
  getVocabularyList,
  lookupWord,
  saveVocabulary,
  updateVocabularyNote,
} from "@/services/dictionary";

export function useLookupWord(word: string | null) {
  return useQuery({
    queryKey: ["dictionary", "lookup", word],
    queryFn: () => lookupWord(word!),
    enabled: !!word && word.trim().length > 0,
    retry: 2,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSaveVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entryId,
      note,
      context,
    }: {
      entryId: string;
      note?: string;
      context?: string;
    }) => saveVocabulary(entryId, note, context),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
    },
  });
}

export function useVocabularyList(params?: { pageIndex?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["vocabulary", "list", params],
    queryFn: () => getVocabularyList(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateVocabularyNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => updateVocabularyNote(id, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
    },
  });
}

export function useDeleteVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVocabulary(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
    },
  });
}
