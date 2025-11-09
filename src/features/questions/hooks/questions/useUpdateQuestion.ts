import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion } from '@features/questions/api/questionsApi';
import { invalidateQuestionQueries } from '@features/questions/utils/queryUtils';
import type { UpdateQuestionRequest, UseUpdateQuestionReturn } from '@features/questions/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useUpdateQuestion = (): UseUpdateQuestionReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateQuestionRequest }) =>
      updateQuestion(id, request),
    onSuccess: async (_, variables) => {
      await invalidateQuestionQueries(queryClient, variables.id);
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to update question') : null,
    updateQuestion: async (id: number, request: UpdateQuestionRequest) => {
      return await mutation.mutateAsync({ id, request });
    },
  };
};
