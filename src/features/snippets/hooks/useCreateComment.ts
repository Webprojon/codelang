import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../services/snippetService';
import type { CreateCommentRequest, CreateCommentResponse } from '../types';

interface UseCreateCommentReturn {
  isSubmitting: boolean;
  error: string | null;
  createComment: (request: CreateCommentRequest) => Promise<CreateCommentResponse>;
}

export const useCreateComment = (): UseCreateCommentReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
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
        queryKey: ['snippet', variables.snippetId],
        refetchType: 'active',
      });
    },
  });

  return {
    isSubmitting: mutation.isPending,
    error: mutation.error
      ? mutation.error instanceof Error
        ? mutation.error.message
        : 'Failed to create comment'
      : null,
    createComment: async (request: CreateCommentRequest) => {
      return await mutation.mutateAsync(request);
    },
  };
};
