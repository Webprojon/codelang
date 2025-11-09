import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSnippets } from '@features/snippets/api/snippetApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type { UseHomeSnippetsReturn } from '@features/home/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useHomeSnippets = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseHomeSnippetsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['snippets', currentPage, limit],
    queryFn: () => getSnippets(currentPage, limit),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    snippets: data?.snippets || [],
    isLoading,
    isError,
    error: error ? getErrorMessage(error, 'Failed to load snippets') : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
    refetch,
  };
};
