import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../constants';
import { getErrorMessage } from '../utils/errorHandler';
import { getDefaultQueryConfig } from './useQueryConfig';
import type { PaginationMeta } from '../types/api';

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface UsePaginatedQueryOptions {
  staleTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  enabled?: boolean;
}

export interface UsePaginatedQueryReturn<T> {
  items: T[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<unknown>;
}

export function usePaginatedQuery<T>(
  queryKey: (string | number)[],
  queryFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  options: {
    initialPage?: number;
    limit?: number;
    errorMessage?: string;
    queryOptions?: UsePaginatedQueryOptions;
  } = {}
): UsePaginatedQueryReturn<T> {
  const {
    initialPage = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    errorMessage = 'Failed to load data',
    queryOptions = {},
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);

  const queryConfig = getDefaultQueryConfig({
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });

  const { data, isLoading, isError, error, refetch }: UseQueryResult<PaginatedResponse<T>> =
    useQuery({
      queryKey: [...queryKey, currentPage, limit],
      queryFn: () => queryFn(currentPage, limit),
      ...queryConfig,
    });

  return {
    items: data?.items || [],
    isLoading,
    isError,
    error: error ? getErrorMessage(error, errorMessage) : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
    refetch,
  };
}
