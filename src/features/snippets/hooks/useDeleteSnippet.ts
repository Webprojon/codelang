import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSnippet } from '../api/snippetApi';
import { invalidateSnippetQueries } from '../utils/queryUtils';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

interface UseDeleteSnippetReturn {
  isDeleting: boolean;
  error: string | null;
  deleteSnippet: (id: number) => Promise<void>;
}

export const useDeleteSnippet = (): UseDeleteSnippetReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteSnippet(id),
    onSuccess: (_, id) => {
      invalidateSnippetQueries(queryClient, id);
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
