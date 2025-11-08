import { QueryClient } from '@tanstack/react-query';

export const invalidateQuestionQueries = (queryClient: QueryClient, questionId?: number) => {
  queryClient.invalidateQueries({ queryKey: ['questions'] });

  if (questionId !== undefined) {
    queryClient.invalidateQueries({ queryKey: ['question', questionId] });
  }
};
