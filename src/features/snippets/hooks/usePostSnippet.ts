import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet } from '../services/snippetService';
import type { PostSnippetRequest } from '../types';

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
      queryClient.invalidateQueries({
        queryKey: ['snippets'],
      });

      queryClient.invalidateQueries({
        queryKey: ['my-snippets'],
      });

      queryClient.refetchQueries({
        queryKey: ['snippets'],
      });

      queryClient.refetchQueries({
        queryKey: ['my-snippets'],
      });
    },
  });

  return {
    isSubmitting: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : 'Failed to create snippet'
      : null,
    submitSnippet: async (request: PostSnippetRequest) => {
      return await mutation.mutateAsync(request);
    },
  };
};
