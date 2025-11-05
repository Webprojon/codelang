import { useState, useEffect } from 'react';
import { getSnippets } from '../../snippets/services/snippetService';
import type { Snippet } from '../../snippets/types';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../constants';

interface UseHomeSnippetsReturn {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const useHomeSnippets = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseHomeSnippetsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getSnippets(currentPage, limit);
        setSnippets(response.snippets);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch snippets';
        setError(errorMessage);
        setSnippets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, [currentPage, limit]);

  return {
    snippets,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  };
};
