import { deleteAnswer } from '@features/questions/api/answersApi';
import type { UseDeleteAnswerReturn, Question } from '@features/questions/types';
import { useDeleteMutation } from '@shared/hooks/useDeleteMutation';
import { useAuthStore } from '@features/auth/store/authStore';
import { QueryClient } from '@tanstack/react-query';

interface DeleteAnswerVariables {
  id: number;
  questionId: number;
}

export const useDeleteAnswer = (): UseDeleteAnswerReturn => {
  const user = useAuthStore(state => state.user);

  const { isDeleting, error, deleteItem } = useDeleteMutation<DeleteAnswerVariables>({
    mutationFn: ({ id }) => deleteAnswer(id),
    errorMessage: 'Failed to delete answer',
    invalidateQueries: async (queryClient: QueryClient, variables: DeleteAnswerVariables) => {
      await queryClient.invalidateQueries({
        queryKey: ['question', variables.questionId],
        exact: true,
      });
    },
    invalidateUserStats: async (queryClient: QueryClient, variables: DeleteAnswerVariables) => {
      const question = queryClient.getQueryData<Question>(['question', variables.questionId]);
      const answer = question?.answers.find(a => a.id === variables.id);
      const userId = answer?.user?.id || user?.id;

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
    deleteAnswer: async (id: number, questionId: number) => {
      await deleteItem({ id, questionId });
    },
  };
};
