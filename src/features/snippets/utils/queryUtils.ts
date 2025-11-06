import { QueryClient } from '@tanstack/react-query';

export const invalidateSnippetQueries = (queryClient: QueryClient, snippetId?: number) => {
  queryClient.invalidateQueries({
    queryKey: ['snippets'],
    refetchType: 'active',
  });

  queryClient.invalidateQueries({
    queryKey: ['my-snippets'],
    refetchType: 'active',
  });

  if (snippetId !== undefined) {
    queryClient.invalidateQueries({
      queryKey: ['snippet', snippetId],
      refetchType: 'active',
    });
  }
};
