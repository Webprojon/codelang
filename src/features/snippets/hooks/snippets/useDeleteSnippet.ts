import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSnippet } from '../../api/snippetApi';
import type { UseDeleteSnippetReturn, ApiSnippet } from '../../types';
import { invalidateSnippetQueries } from '../../utils/queryUtils';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { useAuthStore } from '@features/auth/store/authStore';

export const useDeleteSnippet = (): UseDeleteSnippetReturn => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: (id: number) => deleteSnippet(id),
    onSuccess: async (_, id) => {
      await invalidateSnippetQueries(queryClient, id);

      const snippet = queryClient.getQueryData<ApiSnippet>(['snippet', id]);
      const userId = snippet?.user?.id ? parseInt(snippet.user.id, 10) : user?.id;

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
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to delete snippet') : null,
    deleteSnippet: async (id: number) => {
      return await mutation.mutateAsync(id);
    },
  };
};
