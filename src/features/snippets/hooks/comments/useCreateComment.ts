import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@features/snippets/api/snippetApi';
import type { CreateCommentRequest, UseCreateCommentReturn } from '@features/snippets/types';
import { invalidateSnippetQueries } from '@features/snippets/utils/queryUtils';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useCreateComment = (): UseCreateCommentReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment, variables) => {
      await invalidateSnippetQueries(queryClient, variables.snippetId);

      if (newComment?.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', newComment.user.id],
          exact: true,
          refetchType: 'active',
        });
      }
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
