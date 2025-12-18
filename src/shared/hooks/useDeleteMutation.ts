import { QueryClient } from '@tanstack/react-query';
import { useBaseMutationWithoutData } from './useBaseMutation';

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
  const { isPending, error, mutateAsync } = useBaseMutationWithoutData(options);

  return {
    isDeleting: isPending,
    error,
    deleteItem: mutateAsync,
  };
}
