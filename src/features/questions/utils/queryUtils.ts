import { QueryClient } from '@tanstack/react-query';

export const invalidateQuestionQueries = async (queryClient: QueryClient, questionId?: number) => {
  await queryClient.invalidateQueries({
    queryKey: ['questions'],
    exact: false,
    refetchType: 'all',
  });

  if (questionId !== undefined) {
    await queryClient.invalidateQueries({
      queryKey: ['question', questionId],
      exact: true,
      refetchType: 'all',
    });
  }
};
