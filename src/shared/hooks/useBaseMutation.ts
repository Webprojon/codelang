import { useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@shared/utils/errorHandler';

export interface BaseMutationOptions<TData, TVariables> {
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

export interface BaseMutationOptionsWithoutData<TVariables> {
  mutationFn: (variables: TVariables) => Promise<void>;
  errorMessage: string;
  onSuccess?: (variables: TVariables, queryClient: QueryClient) => Promise<void> | void;
  invalidateQueries?: (queryClient: QueryClient, variables: TVariables) => Promise<void> | void;
  invalidateUserStats?: (queryClient: QueryClient, variables: TVariables) => Promise<void> | void;
}

export interface BaseMutationReturn<TData, TVariables> {
  isPending: boolean;
  error: string | null;
  mutateAsync: (variables: TVariables) => Promise<TData>;
}

export interface BaseMutationReturnWithoutData<TVariables> {
  isPending: boolean;
  error: string | null;
  mutateAsync: (variables: TVariables) => Promise<void>;
}

export function useBaseMutation<TData, TVariables>(
  options: BaseMutationOptions<TData, TVariables>
): BaseMutationReturn<TData, TVariables> {
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
    isPending: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, errorMessage) : null,
    mutateAsync: mutation.mutateAsync,
  };
}

export function useBaseMutationWithoutData<TVariables>(
  options: BaseMutationOptionsWithoutData<TVariables>
): BaseMutationReturnWithoutData<TVariables> {
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
    isPending: mutation.isPending,
    error: mutation.error ? getErrorMessage(mutation.error, errorMessage) : null,
    mutateAsync: mutation.mutateAsync,
  };
}
