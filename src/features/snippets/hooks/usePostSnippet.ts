import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet } from '../api/snippetApi';
import type { PostSnippetRequest } from '../types';
import { invalidateSnippetQueries } from '../utils/queryUtils';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

interface UsePostSnippetReturn {
  isSubmitting: boolean;
  error: string | null;
  submitSnippet: (request: PostSnippetRequest) => Promise<void>;
}

export const usePostSnippet = (): UsePostSnippetReturn => {
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
    submitSnippet: async (request: PostSnippetRequest) => {
      return await mutation.mutateAsync(request);
    },
  };
};
