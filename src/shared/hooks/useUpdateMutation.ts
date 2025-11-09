import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@shared/utils/errorHandler';

export interface UpdateMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  errorMessage: string;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    queryClient: QueryClient
  ) => Promise<void> | void;
  invalidateQueries?: (
    queryClient: QueryClient,
    data: TData,
    variables: TVariables
  ) => Promise<void> | void;
  invalidateUserStats?: (
    queryClient: QueryClient,
    data: TData,
    variables: TVariables
  ) => Promise<void> | void;
}

export interface UseUpdateMutationReturn<TData, TVariables> {
  isUpdating: boolean;
  error: string | null;
  update: (variables: TVariables) => Promise<TData>;
}

export function useUpdateMutation<TData, TVariables>(
  options: UpdateMutationOptions<TData, TVariables>
): UseUpdateMutationReturn<TData, TVariables> {
  const queryClient = useQueryClient();
  const { mutationFn, errorMessage, onSuccess, invalidateQueries, invalidateUserStats } = options;

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      const invalidationPromises: Promise<void>[] = [];

      if (invalidateQueries) {
        const result = invalidateQueries(queryClient, data, variables);
        invalidationPromises.push(result ? result : Promise.resolve());
      }

      if (invalidateUserStats) {
        const result = invalidateUserStats(queryClient, data, variables);
        invalidationPromises.push(result ? result : Promise.resolve());
      }

      await Promise.all(invalidationPromises);

      if (onSuccess) {
        await onSuccess(data, variables, queryClient);
      }
    },
  });

  return {
    isUpdating: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, errorMessage) : null,
    update: async (variables: TVariables) => {
      return await mutation.mutateAsync(variables);
    },
  };
}
