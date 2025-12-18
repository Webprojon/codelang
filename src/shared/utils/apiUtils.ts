import { DEFAULT_META } from '@shared/constants';
import type { PaginationMeta } from '@shared/types/api';

export interface PaginatedApiResponse<TItem> {
  data: TItem[];
  meta: PaginationMeta;
}

export interface NestedPaginatedApiResponse<TItem> {
  data: PaginatedApiResponse<TItem>;
}

export function extractPaginatedData<TItem>(
  response: PaginatedApiResponse<TItem> | NestedPaginatedApiResponse<TItem>
): PaginatedApiResponse<TItem> {
  if (
    'data' in response &&
    response.data &&
    typeof response.data === 'object' &&
    'data' in response.data &&
    'meta' in response.data
  ) {
    return response.data as PaginatedApiResponse<TItem>;
  }

  if ('data' in response && 'meta' in response) {
    return response as PaginatedApiResponse<TItem>;
  }

  return {
    data: [],
    meta: DEFAULT_META,
  };
}

export function transformPaginatedResponse<TItem, TDomainItem>(
  apiResponse: PaginatedApiResponse<TItem> | NestedPaginatedApiResponse<TItem>,
  transformItem: (item: TItem) => TDomainItem
): { items: TDomainItem[]; meta: PaginationMeta } {
  const { data, meta } = extractPaginatedData(apiResponse);

  return {
    items: (data || []).map(transformItem),
    meta: {
      itemsPerPage: meta?.itemsPerPage ?? DEFAULT_META.itemsPerPage,
      totalItems: meta?.totalItems ?? DEFAULT_META.totalItems,
      currentPage: meta?.currentPage ?? DEFAULT_META.currentPage,
      totalPages: meta?.totalPages ?? DEFAULT_META.totalPages,
    },
  };
}

export function transformPaginatedResponseWithContext<TItem, TDomainItem, TContext = void>(
  apiResponse: PaginatedApiResponse<TItem> | NestedPaginatedApiResponse<TItem>,
  transformItem: (item: TItem, context?: TContext) => TDomainItem,
  context?: TContext
): { items: TDomainItem[]; meta: PaginationMeta } {
  const { data, meta } = extractPaginatedData(apiResponse);

  return {
    items: (data || []).map(item => transformItem(item, context)),
    meta: {
      itemsPerPage: meta?.itemsPerPage ?? DEFAULT_META.itemsPerPage,
      totalItems: meta?.totalItems ?? DEFAULT_META.totalItems,
      currentPage: meta?.currentPage ?? DEFAULT_META.currentPage,
      totalPages: meta?.totalPages ?? DEFAULT_META.totalPages,
    },
  };
}
