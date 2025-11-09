import { createAnswer } from '@features/questions/api/answersApi';
import type { CreateAnswerRequest, UseCreateAnswerReturn, Answer } from '@features/questions/types';
import { useCreateMutation } from '@shared/hooks/useCreateMutation';

export const useCreateAnswer = (): UseCreateAnswerReturn => {
  const { isSubmitting, error, create } = useCreateMutation<Answer, CreateAnswerRequest>({
    mutationFn: createAnswer,
    errorMessage: 'Failed to create answer',
    invalidateQueries: async (queryClient, _newAnswer, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['question', variables.questionId],
        exact: true,
      });
    },
    invalidateUserStats: async (queryClient, newAnswer) => {
      if (newAnswer.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', newAnswer.user.id],
          exact: true,
        });
      }
    },
  });

  return {
    isSubmitting,
    error,
    createAnswer: async (request: CreateAnswerRequest) => {
      await create(request);
    },
  };
};
