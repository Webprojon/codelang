import { QueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

export interface InvalidateQueriesOptions {
  queryClient: QueryClient;
  listQueryKey: QueryKey;
  detailQueryKey?: QueryKey;
  additionalQueryKeys?: QueryKey[];
  exact?: boolean;
  refetchType?: 'active' | 'inactive' | 'all' | 'none';
}

export const invalidateQueries = async (options: InvalidateQueriesOptions): Promise<void> => {
  const {
    queryClient,
    listQueryKey,
    detailQueryKey,
    additionalQueryKeys = [],
    exact = false,
    refetchType = 'all',
  } = options;

  await queryClient.invalidateQueries({
    queryKey: listQueryKey,
    exact,
    refetchType,
  });

  for (const queryKey of additionalQueryKeys) {
    await queryClient.invalidateQueries({
      queryKey,
      exact: false,
      refetchType,
    });
  }

  if (detailQueryKey) {
    await queryClient.invalidateQueries({
      queryKey: detailQueryKey,
      exact: true,
      refetchType,
    });
  }
};

export const invalidateQuestionQueries = async (
  queryClient: QueryClient,
  questionId?: number
): Promise<void> => {
  await invalidateQueries({
    queryClient,
    listQueryKey: ['questions'],
    detailQueryKey: questionId !== undefined ? ['question', questionId] : undefined,
    exact: false,
    refetchType: 'all',
  });
};

export const invalidateSnippetQueries = async (
  queryClient: QueryClient,
  snippetId?: number
): Promise<void> => {
  await invalidateQueries({
    queryClient,
    listQueryKey: ['snippets'],
    detailQueryKey: snippetId !== undefined ? ['snippet', snippetId] : undefined,
    additionalQueryKeys: [['my-snippets']],
    exact: false,
    refetchType: 'all',
  });
};
