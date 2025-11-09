import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '@features/questions/api/questionsApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type { UseQuestionsReturn } from '@features/questions/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useQuestions = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseQuestionsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['questions', currentPage, limit],
    queryFn: () => getQuestions(currentPage, limit),
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    questions: data?.questions || [],
    isLoading,
    isError,
    error: error ? getErrorMessage(error, 'Failed to load questions') : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
    refetch,
  };
};
