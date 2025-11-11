import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { usePaginatedQuery } from '@shared/hooks/usePaginatedQuery';
import { getMySnippets } from '@features/snippets/api/snippetApi';
import type { UseMySnippetsReturn, SnippetsResponse, Snippet } from '@features/snippets/types';

export const useMySnippets = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseMySnippetsReturn => {
  const { items, ...rest } = usePaginatedQuery<Snippet, SnippetsResponse>({
    queryKey: ['my-snippets'],
    queryFn: getMySnippets,
    errorMessage: 'Failed to load your snippets',
    extractItems: response => response.snippets,
    initialPage,
    limit,
  });

  return {
    snippets: items,
    ...rest,
  };
};
