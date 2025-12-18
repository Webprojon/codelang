import { deleteQuestion } from '@features/questions/api/questionsApi';
import { invalidateQuestionQueries } from '@shared/utils/queryUtils';
import type { UseDeleteQuestionReturn, Question } from '@features/questions/types';
import { useDeleteMutation } from '@shared/hooks/useDeleteMutation';
import { useAuthStore } from '@features/auth/store/authStore';
import { QueryClient } from '@tanstack/react-query';

export const useDeleteQuestion = (): UseDeleteQuestionReturn => {
  const user = useAuthStore(state => state.user);

  const { isDeleting, error, deleteItem } = useDeleteMutation<number>({
    mutationFn: (id: number) => deleteQuestion(id),
    errorMessage: 'Failed to delete question',
    invalidateQueries: async (queryClient: QueryClient, id: number) => {
      await invalidateQuestionQueries(queryClient, id);
    },
    invalidateUserStats: async (queryClient: QueryClient, id: number) => {
      const question = queryClient.getQueryData<Question>(['question', id]);
      const userId = question?.user?.id || user?.id;

      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', userId],
          exact: true,
        });
      }
    },
  });

  return {
    isDeleting,
    error,
    deleteQuestion: async (id: number) => {
      return await deleteItem(id);
    },
  };
};
