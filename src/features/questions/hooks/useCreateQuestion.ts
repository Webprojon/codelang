import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion } from '../api/questionsApi';
import { invalidateQuestionQueries } from '../utils/queryUtils';
import type { CreateQuestionRequest, UseCreateQuestionReturn } from '../types';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export const useCreateQuestion = (): UseCreateQuestionReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      invalidateQuestionQueries(queryClient);
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
