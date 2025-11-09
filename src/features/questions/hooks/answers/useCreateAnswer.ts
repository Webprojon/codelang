import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnswer } from '@features/questions/api/answersApi';
import type { CreateAnswerRequest, UseCreateAnswerReturn } from '@features/questions/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useCreateAnswer = (): UseCreateAnswerReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAnswer,
    onSuccess: async (newAnswer, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['question', variables.questionId],
        exact: true,
        refetchType: 'active',
      });

      if (newAnswer.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', newAnswer.user.id],
          exact: true,
          refetchType: 'active',
        });
      }
    },
  });

  return {
    isSubmitting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to create answer') : null,
    createAnswer: async (request: CreateAnswerRequest) => {
      await mutation.mutateAsync(request);
    },
  };
};
