import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSnippet } from '../services/snippetService';
import type { UpdateSnippetRequest, ApiSnippet } from '../types';
import { invalidateSnippetQueries } from '../utils/queryUtils';
import { getErrorMessage } from '../utils/errorUtils';

interface UseUpdateSnippetReturn {
  isUpdating: boolean;
  error: string | null;
  updateSnippet: (id: number, request: UpdateSnippetRequest) => Promise<ApiSnippet>;
}

export const useUpdateSnippet = (): UseUpdateSnippetReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateSnippetRequest }) =>
      updateSnippet(id, request),
    onSuccess: (_, variables) => {
      invalidateSnippetQueries(queryClient, variables.id);
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
