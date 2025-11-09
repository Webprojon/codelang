import { createQuestion } from '@features/questions/api/questionsApi';
import { invalidateQuestionQueries } from '@shared/utils/queryUtils';
import type {
  CreateQuestionRequest,
  UseCreateQuestionReturn,
  Question,
} from '@features/questions/types';
import { useCreateMutation } from '@shared/hooks/useCreateMutation';

export const useCreateQuestion = (): UseCreateQuestionReturn => {
  const { isSubmitting, error, create } = useCreateMutation<Question, CreateQuestionRequest>({
    mutationFn: createQuestion,
    errorMessage: 'Failed to create question',
    invalidateQueries: async queryClient => {
      await invalidateQuestionQueries(queryClient);
    },
    invalidateUserStats: async (queryClient, newQuestion) => {
      if (newQuestion.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', newQuestion.user.id],
          exact: true,
        });
      }
    },
  });

  return {
    isSubmitting,
    error,
    createQuestion: async (request: CreateQuestionRequest) => {
      await create(request);
    },
  };
};
