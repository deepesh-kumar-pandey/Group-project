export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export function parsePagination(
  page?: number | string,
  limit?: number | string,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams {
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.min(maxLimit, Math.max(1, Number(limit) || defaultLimit));
  return { page: parsedPage, limit: parsedLimit };
}

export function buildPaginationMeta(
  total: number,
  { page, limit }: PaginationParams
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function getSkip({ page, limit }: PaginationParams): number {
  return (page - 1) * limit;
}
