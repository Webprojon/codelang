import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestion } from '../../api/questionsApi';
import { invalidateQuestionQueries } from '../../utils/queryUtils';
import type { UseDeleteQuestionReturn, Question } from '../../types';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { useAuthStore } from '@features/auth/store/authStore';

export const useDeleteQuestion = (): UseDeleteQuestionReturn => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: async (_, id) => {
      const question = queryClient.getQueryData<Question>(['question', id]);
      const userId = question?.user?.id || user?.id;

      await invalidateQuestionQueries(queryClient, id);

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
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to delete question') : null,
    deleteQuestion: async (id: number) => {
      return await mutation.mutateAsync(id);
    },
  };
};
