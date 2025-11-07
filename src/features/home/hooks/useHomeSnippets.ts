import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSnippets } from '../../snippets/api/snippetApi';
import type { UseHomeSnippetsReturn } from '../types';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export const useHomeSnippets = (
  initialPage: number = 1,
  limit: number = 15
): UseHomeSnippetsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, error } = useQuery({
    queryKey: ['snippets', currentPage, limit],
    queryFn: () => getSnippets(currentPage, limit),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    snippets: data?.snippets || [],
    isLoading,
    error: error ? getErrorMessage(error) : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
  };
};
