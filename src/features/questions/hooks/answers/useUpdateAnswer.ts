import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAnswer } from '../../api/answersApi';
import type { UpdateAnswerRequest, UseUpdateAnswerReturn } from '../../types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useUpdateAnswer = (): UseUpdateAnswerReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: UpdateAnswerRequest;
      questionId: number;
    }) => {
      return updateAnswer(id, request);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['question', variables.questionId],
        exact: true,
        refetchType: 'active',
      });
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to update answer') : null,
    updateAnswer: async (id: number, questionId: number, request: UpdateAnswerRequest) => {
      await mutation.mutateAsync({ id, request, questionId });
    },
  };
};
