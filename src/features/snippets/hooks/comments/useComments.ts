import { useMemo } from 'react';
import type { ApiComment, ApiSnippet } from '@features/snippets/types';

export interface UseCommentsReturn {
  comments: ApiComment[];
  totalComments: number;
}

export const useComments = (snippet: ApiSnippet | null | undefined): UseCommentsReturn => {
  const comments = useMemo(() => {
    if (!snippet) return [];
    return snippet.comments || [];
  }, [snippet]);

  return {
    comments,
    totalComments: comments.length,
  };
};
