import { createComment } from '@features/snippets/api/snippetApi';
import type {
  CreateCommentRequest,
  UseCreateCommentReturn,
  CreateCommentResponse,
} from '@features/snippets/types';
import { invalidateSnippetQueries } from '@shared/utils/queryUtils';
import { useCreateMutation } from '@shared/hooks/useCreateMutation';

export const useCreateComment = (): UseCreateCommentReturn => {
  const { isSubmitting, error, create } = useCreateMutation<
    CreateCommentResponse,
    CreateCommentRequest
  >({
    mutationFn: createComment,
    errorMessage: 'Failed to create comment',
    invalidateQueries: async (queryClient, _newComment, variables) => {
      await invalidateSnippetQueries(queryClient, variables.snippetId);
    },
    invalidateUserStats: async (queryClient, newComment) => {
      if (newComment?.user?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['userStatistics', newComment.user.id],
          exact: true,
        });
      }
    },
  });

  return {
    isSubmitting,
    error,
    createComment: async (request: CreateCommentRequest) => {
      return await create(request);
    },
  };
};
