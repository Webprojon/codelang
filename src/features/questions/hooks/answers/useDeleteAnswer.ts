import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAnswer } from '../../api/answersApi';
import { invalidateQuestionQueries } from '../../utils/queryUtils';
import type { UseDeleteAnswerReturn } from '../../types';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';

export const useDeleteAnswer = (): UseDeleteAnswerReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number; questionId: number }) => deleteAnswer(id),
    onSuccess: (_, variables) => {
      invalidateQuestionQueries(queryClient, variables.questionId);
    },
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to delete answer') : null,
    deleteAnswer: async (id: number, questionId: number) => {
      await mutation.mutateAsync({ id, questionId });
    },
  };
};
