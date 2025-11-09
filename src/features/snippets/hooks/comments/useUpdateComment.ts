import { updateComment } from '@features/snippets/api/snippetApi';
import type {
  UpdateCommentRequest,
  UseUpdateCommentReturn,
  UpdateCommentResponse,
} from '@features/snippets/types';
import { invalidateSnippetQueries } from '@shared/utils/queryUtils';
import { useUpdateMutation } from '@shared/hooks/useUpdateMutation';

interface UpdateCommentVariables {
  id: number;
  request: UpdateCommentRequest;
}

export const useUpdateComment = (snippetId: number): UseUpdateCommentReturn => {
  const { isUpdating, error, update } = useUpdateMutation<
    UpdateCommentResponse,
    UpdateCommentVariables
  >({
    mutationFn: ({ id, request }) => updateComment(id, request),
    errorMessage: 'Failed to update comment',
    invalidateQueries: async queryClient => {
      await invalidateSnippetQueries(queryClient, snippetId);
    },
  });

  return {
    isUpdating,
    error,
    updateComment: async (id: number, request: UpdateCommentRequest): Promise<void> => {
      await update({ id, request });
    },
  };
};
