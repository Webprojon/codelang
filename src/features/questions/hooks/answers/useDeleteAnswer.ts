import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAnswer } from '../../api/answersApi';
import type { UseDeleteAnswerReturn, Question } from '../../types';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';
import { useAuthStore } from '../../../auth/store/authStore';

export const useDeleteAnswer = (): UseDeleteAnswerReturn => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number; questionId: number }) => deleteAnswer(id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['question', variables.questionId],
        exact: true,
        refetchType: 'active',
      });

      const question = queryClient.getQueryData<Question>(['question', variables.questionId]);
      const answer = question?.answers.find(a => a.id === variables.id);
      const userId = answer?.user?.id || user?.id;

      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', userId],
          exact: true,
          refetchType: 'active',
        });
      }
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
