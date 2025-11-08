import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnswer } from '../../api/answersApi';
import { invalidateQuestionQueries } from '../../utils/queryUtils';
import type { CreateAnswerRequest, UseCreateAnswerReturn } from '../../types';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';

export const useCreateAnswer = (): UseCreateAnswerReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAnswer,
    onSuccess: (_, variables) => {
      invalidateQuestionQueries(queryClient, variables.questionId);
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
