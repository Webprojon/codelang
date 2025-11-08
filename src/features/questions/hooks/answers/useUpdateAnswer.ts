import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAnswer } from '../../api/answersApi';
import { invalidateQuestionQueries } from '../../utils/queryUtils';
import type { UpdateAnswerRequest, UseUpdateAnswerReturn } from '../../types';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';

export const useUpdateAnswer = (): UseUpdateAnswerReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      request,
      questionId,
    }: {
      id: number;
      request: UpdateAnswerRequest;
      questionId: number;
    }) => {
      void questionId;
      return updateAnswer(id, request);
    },
    onSuccess: (_, variables) => {
      invalidateQuestionQueries(queryClient, variables.questionId);
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
