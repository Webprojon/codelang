import { createSnippet } from '@features/snippets/api/snippetApi';
import type { PostSnippetRequest, UseCreateSnippetReturn } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@shared/utils/queryUtils';
import { useCreateMutation } from '@shared/hooks/useCreateMutation';
import { useAuthStore } from '@features/auth/store/authStore';

export const useCreateSnippet = (): UseCreateSnippetReturn => {
  const user = useAuthStore(state => state.user);

  const { isSubmitting, error, create } = useCreateMutation<void, PostSnippetRequest>({
    mutationFn: createSnippet,
    errorMessage: 'Failed to create snippet',
    invalidateQueries: async queryClient => {
      await invalidateSnippetQueries(queryClient);
    },
    invalidateUserStats: async queryClient => {
      if (user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', user.id],
          exact: true,
        });
      }
    },
  });

  return {
    isSubmitting,
    error,
    createSnippet: async (request: PostSnippetRequest) => {
      return await create(request);
    },
  };
};
