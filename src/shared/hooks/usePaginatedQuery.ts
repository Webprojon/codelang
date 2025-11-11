import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { getErrorMessage } from '@shared/utils/errorHandler';
import type { PaginationMeta } from '@shared/types/api';

export interface PaginatedResponse {
  meta: PaginationMeta;
}

export interface UsePaginatedQueryOptions<TData, TResponse extends PaginatedResponse> {
  queryKey: (string | number)[];
  queryFn: (page: number, limit: number) => Promise<TResponse>;
  errorMessage: string;
  extractItems: (response: TResponse) => TData[];
  initialPage?: number;
  limit?: number;
}

export interface UsePaginatedQueryReturn<TData> {
  items: TData[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<unknown>;
}

export function usePaginatedQuery<TData, TResponse extends PaginatedResponse>(
  options: UsePaginatedQueryOptions<TData, TResponse>
): UsePaginatedQueryReturn<TData> {
  const {
    queryKey,
    queryFn,
    errorMessage,
    extractItems,
    initialPage = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery<TResponse>({
    queryKey: [...queryKey, currentPage, limit],
    queryFn: () => queryFn(currentPage, limit),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    items: data ? extractItems(data) : [],
    isLoading,
    isError,
    error: error ? getErrorMessage(error, errorMessage) : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
    refetch,
  };
}
