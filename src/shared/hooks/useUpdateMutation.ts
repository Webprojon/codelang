import { QueryClient } from '@tanstack/react-query';
import { useBaseMutation } from './useBaseMutation';

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
  const { isPending, error, mutateAsync } = useBaseMutation(options);

  return {
    isUpdating: isPending,
    error,
    update: mutateAsync,
  };
}
