import { deleteSnippet } from '@features/snippets/api/snippetApi';
import type { UseDeleteSnippetReturn, ApiSnippet } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@shared/utils/queryUtils';
import { useDeleteMutation } from '@shared/hooks/useDeleteMutation';
import { useAuthStore } from '@features/auth/store/authStore';
import { QueryClient } from '@tanstack/react-query';

export const useDeleteSnippet = (): UseDeleteSnippetReturn => {
  const user = useAuthStore(state => state.user);

  const { isDeleting, error, deleteItem } = useDeleteMutation<number>({
    mutationFn: (id: number) => deleteSnippet(id),
    errorMessage: 'Failed to delete snippet',
    invalidateQueries: async (queryClient: QueryClient, id: number) => {
      await invalidateSnippetQueries(queryClient, id);
    },
    invalidateUserStats: async (queryClient: QueryClient, id: number) => {
      const snippet = queryClient.getQueryData<ApiSnippet>(['snippet', id]);
      const userId = snippet?.user?.id ? parseInt(snippet.user.id, 10) : user?.id;

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
    deleteSnippet: async (id: number) => {
      return await deleteItem(id);
    },
  };
};
