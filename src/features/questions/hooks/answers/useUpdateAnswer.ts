import { updateAnswer } from '@features/questions/api/answersApi';
import type { UpdateAnswerRequest, UseUpdateAnswerReturn, Answer } from '@features/questions/types';
import { useUpdateMutation } from '@shared/hooks/useUpdateMutation';

interface UpdateAnswerVariables {
  id: number;
  request: UpdateAnswerRequest;
  questionId: number;
}

export const useUpdateAnswer = (): UseUpdateAnswerReturn => {
  const { isUpdating, error, update } = useUpdateMutation<Answer, UpdateAnswerVariables>({
    mutationFn: ({ id, request }) => updateAnswer(id, request),
    errorMessage: 'Failed to update answer',
    invalidateQueries: async (queryClient, _, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['question', variables.questionId],
        exact: true,
      });
    },
  });

  return {
    isUpdating,
    error,
    updateAnswer: async (id: number, questionId: number, request: UpdateAnswerRequest) => {
      await update({ id, request, questionId });
    },
  };
};
