export type FindAllDto = FindWithKeywordDto & {
  pageIndex?: number;
  pageSize?: number;
};

export type FindAllLimitDto = FindWithKeywordDto & {
  limit?: number;
  skip?: number;
};

export type FindWithKeywordDto = {
  keyword?: string;
  /** endpoint api */

  endpoint?: string;
};

export type FindServiceTypeIsActiveWithKeywordDto = {
  keyword?: string;
  /** endpoint api */
  isActive: boolean;
  endpoint?: string;
};
