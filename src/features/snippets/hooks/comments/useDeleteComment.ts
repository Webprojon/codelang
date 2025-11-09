import { deleteComment } from '@features/snippets/api/snippetApi';
import type { UseDeleteCommentReturn, ApiSnippet } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@shared/utils/queryUtils';
import { useDeleteMutation } from '@shared/hooks/useDeleteMutation';
import { useAuthStore } from '@features/auth/store/authStore';
import { QueryClient } from '@tanstack/react-query';

export const useDeleteComment = (snippetId: number): UseDeleteCommentReturn => {
  const user = useAuthStore(state => state.user);

  const { isDeleting, error, deleteItem } = useDeleteMutation<number>({
    mutationFn: (commentId: number) => deleteComment(commentId),
    errorMessage: 'Failed to delete comment',
    invalidateQueries: async (queryClient: QueryClient) => {
      await invalidateSnippetQueries(queryClient, snippetId);
    },
    invalidateUserStats: async (queryClient: QueryClient, commentId: number) => {
      const snippet = queryClient.getQueryData<ApiSnippet>(['snippet', snippetId]);
      const comment = snippet?.comments?.find(c => parseInt(c.id, 10) === commentId);
      const userId = comment?.user?.id ? parseInt(comment.user.id, 10) : user?.id;

      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', userId],
          exact: true,
        });
      }
    },
  });

  return {
    isDeleting,
    error,
    deleteComment: async (id: number) => {
      return await deleteItem(id);
    },
  };
};
