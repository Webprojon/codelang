import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@shared/utils/errorHandler';

export interface DeleteMutationOptions<TVariables> {
  mutationFn: (variables: TVariables) => Promise<void>;
  errorMessage: string;
  onSuccess?: (variables: TVariables, queryClient: QueryClient) => Promise<void> | void;
  invalidateQueries?: (queryClient: QueryClient, variables: TVariables) => Promise<void> | void;
  invalidateUserStats?: (queryClient: QueryClient, variables: TVariables) => Promise<void> | void;
}

export interface UseDeleteMutationReturn<TVariables> {
  isDeleting: boolean;
  error: string | null;
  deleteItem: (variables: TVariables) => Promise<void>;
}

export function useDeleteMutation<TVariables>(
  options: DeleteMutationOptions<TVariables>
): UseDeleteMutationReturn<TVariables> {
  const queryClient = useQueryClient();
  const { mutationFn, errorMessage, onSuccess, invalidateQueries, invalidateUserStats } = options;

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (_, variables) => {
      const invalidationPromises: Promise<void>[] = [];

      if (invalidateQueries) {
        const result = invalidateQueries(queryClient, variables);
        invalidationPromises.push(result ? result : Promise.resolve());
      }

      if (invalidateUserStats) {
        const result = invalidateUserStats(queryClient, variables);
        invalidationPromises.push(result ? result : Promise.resolve());
      }

      await Promise.all(invalidationPromises);

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
