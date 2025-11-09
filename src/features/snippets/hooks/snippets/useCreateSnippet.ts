import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet } from '@features/snippets/api/snippetApi';
import type { PostSnippetRequest, UseCreateSnippetReturn } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@features/snippets/utils/queryUtils';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { useAuthStore } from '@features/auth/store/authStore';

export const useCreateSnippet = (): UseCreateSnippetReturn => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: async () => {
      await invalidateSnippetQueries(queryClient);

      if (user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', user.id],
          exact: true,
          refetchType: 'active',
        });
      }
    },
  });

  return {
    isSubmitting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to create snippet') : null,
    createSnippet: async (request: PostSnippetRequest) => {
      return await mutation.mutateAsync(request);
    },
  };
};
