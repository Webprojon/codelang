import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '@features/snippets/api/snippetApi';
import type { UpdateCommentRequest, UseUpdateCommentReturn } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@features/snippets/utils/queryUtils';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useUpdateComment = (snippetId: number): UseUpdateCommentReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCommentRequest }) =>
      updateComment(id, request),
    onSuccess: async () => {
      await invalidateSnippetQueries(queryClient, snippetId);
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to update comment') : null,
    updateComment: async (id: number, request: UpdateCommentRequest): Promise<void> => {
      await mutation.mutateAsync({ id, request });
    },
  };
};
