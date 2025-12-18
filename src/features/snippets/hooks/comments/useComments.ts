import type { ApiComment, ApiSnippet } from '@features/snippets/types';

export interface UseCommentsReturn {
  comments: ApiComment[];
  totalComments: number;
}

export const useComments = (snippet: ApiSnippet | null | undefined): UseCommentsReturn => {
  const comments = snippet?.comments || [];

  return {
    comments,
    totalComments: comments.length,
  };
};
