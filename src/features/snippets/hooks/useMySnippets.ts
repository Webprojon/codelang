import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMySnippets } from '../api/snippetApi';
import type { UseMySnippetsReturn } from '../types';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export const useMySnippets = (initialPage: number = 1, limit: number = 15): UseMySnippetsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-snippets', currentPage, limit],
    queryFn: () => getMySnippets(currentPage, limit),
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
