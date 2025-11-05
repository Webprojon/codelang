export interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export interface HomeSnippetsState {
  snippets: unknown[];
  isLoading: boolean;
  error: string | null;
}
