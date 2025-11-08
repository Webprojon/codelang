import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '../api/questionsApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../../shared/constants';
import type { UseQuestionsReturn } from '../types';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export const useQuestions = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseQuestionsReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', currentPage, limit],
    queryFn: () => getQuestions(currentPage, limit),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    questions: data?.questions || [],
    isLoading,
    error: error ? getErrorMessage(error) : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
  };
};
