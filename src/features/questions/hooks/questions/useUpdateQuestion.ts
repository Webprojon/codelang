import { updateQuestion } from '@features/questions/api/questionsApi';
import { invalidateQuestionQueries } from '@shared/utils/queryUtils';
import type {
  UpdateQuestionRequest,
  UseUpdateQuestionReturn,
  Question,
} from '@features/questions/types';
import { useUpdateMutation } from '@shared/hooks/useUpdateMutation';

interface UpdateQuestionVariables {
  id: number;
  request: UpdateQuestionRequest;
}

export const useUpdateQuestion = (): UseUpdateQuestionReturn => {
  const { isUpdating, error, update } = useUpdateMutation<Question, UpdateQuestionVariables>({
    mutationFn: ({ id, request }) => updateQuestion(id, request),
    errorMessage: 'Failed to update question',
    invalidateQueries: async (queryClient, _, variables) => {
      await invalidateQuestionQueries(queryClient, variables.id);
    },
  });

  return {
    isUpdating,
    error,
    updateQuestion: async (id: number, request: UpdateQuestionRequest) => {
      return await update({ id, request });
    },
  };
};
