import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMySnippets } from '../../api/snippetApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type { UseMySnippetsReturn } from '../../types';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { getDefaultQueryConfig } from '@shared/hooks/useQueryConfig';

export const useMySnippets = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseMySnippetsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-snippets', currentPage, limit],
    queryFn: () => getMySnippets(currentPage, limit),
    ...getDefaultQueryConfig({ staleTime: 0 }),
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
