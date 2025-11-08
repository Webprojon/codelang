import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { getErrorMessage } from '../utils/errorHandler';

export interface UseDeleteMutationOptions<TVariables> {
  mutationFn: (variables: TVariables) => Promise<void>;
  onSuccess?: (
    variables: TVariables,
    queryClient: ReturnType<typeof useQueryClient>
  ) => Promise<void> | void;
  errorMessage?: string;
  invalidateQueries?: (
    queryClient: ReturnType<typeof useQueryClient>,
    variables: TVariables
  ) => Promise<void> | void;
}

export interface UseDeleteMutationReturn<TVariables> {
  isDeleting: boolean;
  error: string | null;
  deleteItem: (variables: TVariables) => Promise<void>;
}

export function useDeleteMutation<TVariables>(
  options: UseDeleteMutationOptions<TVariables>
): UseDeleteMutationReturn<TVariables> {
  const { mutationFn, onSuccess, errorMessage = 'Failed to delete', invalidateQueries } = options;
  const queryClient = useQueryClient();

  const mutation: UseMutationResult<void, Error, TVariables> = useMutation({
    mutationFn,
    onSuccess: async (_, variables) => {
      if (invalidateQueries) {
        await invalidateQueries(queryClient, variables);
      }
      if (onSuccess) {
        await onSuccess(variables, queryClient);
      }
    },
  });

  return {
    isDeleting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, errorMessage) : null,
    deleteItem: async (variables: TVariables) => {
      return await mutation.mutateAsync(variables);
    },
  };
}
