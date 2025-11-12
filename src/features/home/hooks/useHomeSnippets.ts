import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { useInfinitePaginatedQuery } from '@shared/hooks/useInfinitePaginatedQuery';
import { getSnippets } from '@features/snippets/api/snippetApi';
import type { UseHomeSnippetsReturn } from '@features/home/types';
import type { SnippetsResponse, Snippet } from '@features/snippets/types';

export const useHomeSnippets = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseHomeSnippetsReturn => {
  const { items, ...rest } = useInfinitePaginatedQuery<Snippet, SnippetsResponse>({
    queryKey: ['snippets'],
    queryFn: getSnippets,
    errorMessage: 'Failed to load snippets',
    extractItems: response => response.snippets,
    initialPage,
    limit,
  });

  return {
    snippets: items,
    ...rest,
  };
};
