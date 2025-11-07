import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../api/snippetApi';
import type { UseDeleteCommentReturn } from '../types';
import { invalidateSnippetQueries } from '../utils/queryUtils';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export const useDeleteComment = (snippetId: number): UseDeleteCommentReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient, snippetId);
    },
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to delete comment') : null,
    deleteComment: async (id: number) => {
      return await mutation.mutateAsync(id);
    },
  };
};
