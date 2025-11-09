import { updateSnippet } from '@features/snippets/api/snippetApi';
import type {
  UpdateSnippetRequest,
  UseUpdateSnippetReturn,
  ApiSnippet,
} from '@features/snippets/types';
import { invalidateSnippetQueries } from '@shared/utils/queryUtils';
import { useUpdateMutation } from '@shared/hooks/useUpdateMutation';

interface UpdateSnippetVariables {
  id: number;
  request: UpdateSnippetRequest;
}

export const useUpdateSnippet = (): UseUpdateSnippetReturn => {
  const { isUpdating, error, update } = useUpdateMutation<ApiSnippet, UpdateSnippetVariables>({
    mutationFn: ({ id, request }) => updateSnippet(id, request),
    errorMessage: 'Failed to update snippet',
    invalidateQueries: async (queryClient, _, variables) => {
      await invalidateSnippetQueries(queryClient, variables.id);
    },
  });

  return {
    isUpdating,
    error,
    updateSnippet: async (id: number, request: UpdateSnippetRequest) => {
      return await update({ id, request });
    },
  };
};
