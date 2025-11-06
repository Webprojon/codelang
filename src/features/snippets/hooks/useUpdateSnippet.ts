import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSnippet } from '../services/snippetService';
import type { UpdateSnippetRequest, ApiSnippet } from '../types';

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
      queryClient.invalidateQueries({
        queryKey: ['snippets'],
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: ['my-snippets'],
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: ['snippet', variables.id],
        refetchType: 'active',
      });
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : 'Failed to update snippet'
      : null,
    updateSnippet: async (id: number, request: UpdateSnippetRequest) => {
      return await mutation.mutateAsync({ id, request });
    },
  };
};
