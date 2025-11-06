import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../services/snippetService';
import type { UpdateCommentRequest } from '../types';
import { invalidateSnippetQueries } from '../utils/queryUtils';
import { getErrorMessage } from '../utils/errorUtils';

interface UseUpdateCommentReturn {
  isUpdating: boolean;
  error: string | null;
  updateComment: (id: number, request: UpdateCommentRequest) => Promise<void>;
}

export const useUpdateComment = (snippetId: number): UseUpdateCommentReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateCommentRequest }) =>
      updateComment(id, request),
    onSuccess: () => {
      invalidateSnippetQueries(queryClient, snippetId);
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, 'Failed to update comment') : null,
    updateComment: async (id: number, request: UpdateCommentRequest): Promise<void> => {
      await mutation.mutateAsync({ id, request });
    },
  };
};
