import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '@features/snippets/api/snippetApi';
import type { UseDeleteCommentReturn, ApiSnippet } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@features/snippets/utils/queryUtils';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { useAuthStore } from '@features/auth/store/authStore';

export const useDeleteComment = (snippetId: number): UseDeleteCommentReturn => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (_, commentId) => {
      await invalidateSnippetQueries(queryClient, snippetId);

      const snippet = queryClient.getQueryData<ApiSnippet>(['snippet', snippetId]);
      const comment = snippet?.comments?.find(c => parseInt(c.id, 10) === commentId);
      const userId = comment?.user?.id ? parseInt(comment.user.id, 10) : user?.id;

      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', userId],
          exact: true,
          refetchType: 'active',
        });
      }
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
