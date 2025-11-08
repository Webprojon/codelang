import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { getErrorMessage } from '../utils/errorHandler';

export interface UseUpdateMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    queryClient: ReturnType<typeof useQueryClient>
  ) => Promise<void> | void;
  errorMessage?: string;
  invalidateQueries?: (
    queryClient: ReturnType<typeof useQueryClient>,
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
  options: UseUpdateMutationOptions<TData, TVariables>
): UseUpdateMutationReturn<TData, TVariables> {
  const { mutationFn, onSuccess, errorMessage = 'Failed to update', invalidateQueries } = options;
  const queryClient = useQueryClient();

  const mutation: UseMutationResult<TData, Error, TVariables> = useMutation({
    mutationFn,
    onSuccess: async (data, variables) => {
      if (invalidateQueries) {
        await invalidateQueries(queryClient, data, variables);
      }
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
