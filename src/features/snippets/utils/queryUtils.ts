import { QueryClient } from '@tanstack/react-query';

export const invalidateSnippetQueries = async (queryClient: QueryClient, snippetId?: number) => {
  await queryClient.invalidateQueries({
    queryKey: ['snippets'],
    refetchType: 'all',
  });

  await queryClient.invalidateQueries({
    queryKey: ['my-snippets'],
    refetchType: 'all',
  });

  if (snippetId !== undefined) {
    await queryClient.invalidateQueries({
      queryKey: ['snippet', snippetId],
      refetchType: 'all',
    });
  }
};
