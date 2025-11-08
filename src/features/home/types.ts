import type { Snippet } from '../snippets/types';

export interface HomeSnippetsState {
  snippets: unknown[];
  isLoading: boolean;
  error: string | null;
}

export interface UseHomeSnippetsReturn {
  snippets: Snippet[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<unknown>;
}
