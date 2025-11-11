import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { usePaginatedQuery } from '@shared/hooks/usePaginatedQuery';
import { getQuestions } from '@features/questions/api/questionsApi';
import type { UseQuestionsReturn, QuestionsResponse, Question } from '@features/questions/types';

export const useQuestions = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseQuestionsReturn => {
  const { items, ...rest } = usePaginatedQuery<Question, QuestionsResponse>({
    queryKey: ['questions'],
    queryFn: getQuestions,
    errorMessage: 'Failed to load questions',
    extractItems: response => response.questions,
    initialPage,
    limit,
  });

  return {
    questions: items,
    ...rest,
  };
};
