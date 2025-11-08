import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { getErrorMessage } from '../utils/errorHandler';

export interface UseCreateMutationOptions<TData, TVariables> {
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

export interface UseCreateMutationReturn<TData, TVariables> {
  isSubmitting: boolean;
  error: string | null;
  create: (variables: TVariables) => Promise<TData>;
}

export function useCreateMutation<TData, TVariables>(
  options: UseCreateMutationOptions<TData, TVariables>
): UseCreateMutationReturn<TData, TVariables> {
  const { mutationFn, onSuccess, errorMessage = 'Failed to create', invalidateQueries } = options;
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
    isSubmitting: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, errorMessage) : null,
    create: async (variables: TVariables) => {
      return await mutation.mutateAsync(variables);
    },
  };
}
