import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestion } from '../../api/questionsApi';
import { invalidateQuestionQueries } from '../../utils/queryUtils';
import type { UseDeleteQuestionReturn } from '../../types';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';

export const useDeleteQuestion = (): UseDeleteQuestionReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: (_, id) => {
      invalidateQuestionQueries(queryClient, id);
    },
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to delete question') : null,
    deleteQuestion: async (id: number) => {
      return await mutation.mutateAsync(id);
    },
  };
};
