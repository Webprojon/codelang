import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../api/snippetApi';
import type { CreateCommentRequest, UseCreateCommentReturn } from '../types';
import { invalidateSnippetQueries } from '../utils/queryUtils';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

export const useCreateComment = (): UseCreateCommentReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      invalidateSnippetQueries(queryClient, variables.snippetId);
    },
  });

  return {
    isSubmitting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to create comment') : null,
    createComment: async (request: CreateCommentRequest) => {
      return await mutation.mutateAsync(request);
    },
  };
};
