import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../../api/questionsApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type { UseQuestionsReturn } from '../../types';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { getDefaultQueryConfig } from '@shared/hooks/useQueryConfig';

export const useQuestions = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseQuestionsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['questions', currentPage, limit],
    queryFn: () => getQuestions(currentPage, limit),
    ...getDefaultQueryConfig({ staleTime: 0 }),
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
