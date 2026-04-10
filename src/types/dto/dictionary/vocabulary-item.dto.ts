export type VocabularyEntryBriefDto = {
  entryId: string;
  headword: string;
  pos: string | null;
  cefrLevel: string | null;
  ipa: string | null;
};

export type VocabularyItemDto = {
  id: string;
  status: string;
  note: string | null;
  context: string | null;
  addedAt: string;
  entry: VocabularyEntryBriefDto;
};
