import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { getErrorMessage } from '@shared/utils/errorHandler';
import type { PaginationMeta } from '@shared/types/api';

export interface PaginatedResponse {
  meta: PaginationMeta;
}

export interface UseInfinitePaginatedQueryOptions<
  TData extends { id: number },
  TResponse extends PaginatedResponse,
> {
  queryKey: (string | number)[];
  queryFn: (page: number, limit: number) => Promise<TResponse>;
  errorMessage: string;
  extractItems: (response: TResponse) => TData[];
  initialPage?: number;
  limit?: number;
}

export interface UseInfinitePaginatedQueryReturn<TData> {
  items: TData[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  loadNextPage: () => void;
  hasMore: boolean;
  refetch: () => Promise<unknown>;
}

export function useInfinitePaginatedQuery<
  TData extends { id: number },
  TResponse extends PaginatedResponse,
>(
  options: UseInfinitePaginatedQueryOptions<TData, TResponse>
): UseInfinitePaginatedQueryReturn<TData> {
  const {
    queryKey,
    queryFn,
    errorMessage,
    extractItems,
    initialPage = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [accumulatedItems, setAccumulatedItems] = useState<TData[]>([]);
  const [totalPagesState, setTotalPagesState] = useState(1);

  const isInfiniteScrollMode = useRef(false);
  const lastProcessedPage = useRef<number | null>(null);
  const extractItemsRef = useRef(extractItems);

  useEffect(() => {
    extractItemsRef.current = extractItems;
  }, [extractItems]);

  const { data, isLoading, isError, error, refetch } = useQuery<TResponse>({
    queryKey: [...queryKey, currentPage, limit],
    queryFn: () => queryFn(currentPage, limit),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (!data || lastProcessedPage.current === currentPage) return;

    const newItems = extractItemsRef.current(data);
    setTotalPagesState(data.meta.totalPages);
    lastProcessedPage.current = currentPage;

    if (isInfiniteScrollMode.current) {
      setAccumulatedItems(prev => (prev.length === 0 ? newItems : [...prev, ...newItems]));
    } else {
      setAccumulatedItems(newItems);
    }
  }, [data, currentPage]);

  const loadNextPage = useCallback(() => {
    if (currentPage < totalPagesState && !isLoading) {
      isInfiniteScrollMode.current = true;
      if (accumulatedItems.length === 0 && data) {
        setAccumulatedItems(extractItemsRef.current(data));
      }
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPagesState, isLoading, data, accumulatedItems.length]);

  const handleSetCurrentPage = (page: number) => {
    isInfiniteScrollMode.current = false;
    setAccumulatedItems([]);
    lastProcessedPage.current = null;
    setCurrentPage(page);
  };

  const hasMore = currentPage < totalPagesState;
  const items =
    accumulatedItems.length > 0 ? accumulatedItems : data ? extractItemsRef.current(data) : [];

  return {
    items,
    isLoading,
    isError,
    error: error ? getErrorMessage(error, errorMessage) : null,
    currentPage,
    totalPages: totalPagesState,
    setCurrentPage: handleSetCurrentPage,
    loadNextPage,
    hasMore,
    refetch,
  };
}
