import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet } from '../../api/snippetApi';
import type { PostSnippetRequest, UseCreateSnippetReturn } from '../../types';
import { invalidateSnippetQueries } from '../../utils/queryUtils';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';

export const useCreateSnippet = (): UseCreateSnippetReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      invalidateSnippetQueries(queryClient);
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
