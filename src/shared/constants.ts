import type { PaginationMeta } from './types/api';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 15;

export const DEFAULT_META: PaginationMeta = {
  itemsPerPage: 0,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};
