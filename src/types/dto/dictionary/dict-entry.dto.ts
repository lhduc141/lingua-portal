export type DictExampleDto = {
  example: string;
  translation: string | null;
};

export type DictCollocationDto = {
  collocationId: string;
  phrase: string;
  meaning: string;
  viMeaning: string | null;
  example: string | null;
  viExample: string | null;
};

export type DictSenseDto = {
  senseId: string;
  shortDef: string;
  viDef: string | null;
  synonyms: string[];
  antonyms: string[];
  examples: DictExampleDto[];
  collocations: DictCollocationDto[];
};

export type WordFormDto = {
  form: string;
  pos: string;
};

export type DictEntryLookupDto = {
  entryId: string;
  headword: string;
  pos: string | null;
  ipa: string | null;
  cefrLevel: string | null;
  source: string | null;
  wordForms: WordFormDto[];
  senses: DictSenseDto[];
  searchedAs?: string;
};
