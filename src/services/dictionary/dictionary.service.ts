import { api, ENDPOINTS } from "@/lib";
import type { DictEntryLookupDto } from "@/types/dto/dictionary";
import type { ResponseDto, ResponsePagingDto } from "@/types";
import type { VocabularyItemDto } from "@/types/dto/dictionary";

export async function lookupWord(word: string): Promise<ResponseDto<DictEntryLookupDto>> {
  return api.get(ENDPOINTS.DICTIONARY.LOOKUP, { params: { word } });
}

export async function getCollocations(entryId: string, cefrLevel?: string) {
  return api.get(ENDPOINTS.DICTIONARY.COLLOCATIONS(entryId), {
    params: cefrLevel ? { cefrLevel } : {},
  });
}

export async function saveVocabulary(entryId: string, note?: string, context?: string) {
  return api.post(ENDPOINTS.VOCABULARY.SAVE, { entryId, note, context });
}

export async function getVocabularyList(params?: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<ResponsePagingDto<VocabularyItemDto>> {
  return api.get(ENDPOINTS.VOCABULARY.LIST, { params });
}

export async function updateVocabularyNote(id: string, note: string) {
  return api.patch(ENDPOINTS.VOCABULARY.UPDATE(id), { note });
}

export async function deleteVocabulary(id: string) {
  return api.delete(ENDPOINTS.VOCABULARY.DELETE(id));
}
