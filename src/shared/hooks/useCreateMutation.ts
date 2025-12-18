import { QueryClient } from '@tanstack/react-query';
import { useBaseMutation } from './useBaseMutation';

export interface CreateMutationOptions<TData, TVariables> {
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

export interface UseCreateMutationReturn<TData, TVariables> {
  isSubmitting: boolean;
  error: string | null;
  create: (variables: TVariables) => Promise<TData>;
}

export function useCreateMutation<TData, TVariables>(
  options: CreateMutationOptions<TData, TVariables>
): UseCreateMutationReturn<TData, TVariables> {
  const { isPending, error, mutateAsync } = useBaseMutation(options);

  return {
    isSubmitting: isPending,
    error,
    create: mutateAsync,
  };
}
