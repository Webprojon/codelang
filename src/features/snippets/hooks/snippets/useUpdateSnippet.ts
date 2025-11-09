import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSnippet } from '@features/snippets/api/snippetApi';
import type { UpdateSnippetRequest, UseUpdateSnippetReturn } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@features/snippets/utils/queryUtils';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useUpdateSnippet = (): UseUpdateSnippetReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateSnippetRequest }) =>
      updateSnippet(id, request),
    onSuccess: async (_, variables) => {
      await invalidateSnippetQueries(queryClient, variables.id);
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to update snippet') : null,
    updateSnippet: async (id: number, request: UpdateSnippetRequest) => {
      return await mutation.mutateAsync({ id, request });
    },
  };
};
