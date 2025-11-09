import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMySnippets } from '@features/snippets/api/snippetApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type { UseMySnippetsReturn } from '@features/snippets/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useMySnippets = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseMySnippetsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-snippets', currentPage, limit],
    queryFn: () => getMySnippets(currentPage, limit),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    snippets: data?.snippets || [],
    isLoading,
    isError,
    error: error ? getErrorMessage(error, 'Failed to load your snippets') : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
    refetch,
  };
};
