import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion } from '@features/questions/api/questionsApi';
import { invalidateQuestionQueries } from '@features/questions/utils/queryUtils';
import type { CreateQuestionRequest, UseCreateQuestionReturn } from '@features/questions/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useCreateQuestion = (): UseCreateQuestionReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: async newQuestion => {
      await invalidateQuestionQueries(queryClient);

      if (newQuestion.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', newQuestion.user.id],
          exact: true,
          refetchType: 'active',
        });
      }
    },
  });

  return {
    isSubmitting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to create question') : null,
    createQuestion: async (request: CreateQuestionRequest) => {
      await mutation.mutateAsync(request);
    },
  };
};
