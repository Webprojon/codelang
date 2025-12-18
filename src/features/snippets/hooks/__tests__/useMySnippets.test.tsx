import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMySnippets } from '../snippets/useMySnippets';
import { getMySnippets } from '@features/snippets/api/snippetApi';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/snippets/api/snippetApi');

const mockGetMySnippets = getMySnippets as jest.MockedFunction<typeof getMySnippets>;

describe('useMySnippets', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it('should return snippets data on successful fetch', async () => {
    const mockSnippets = [
      {
        id: 1,
        title: 'Test Snippet',
        content: 'const test = "code";',
        language: 'JavaScript',
        createdAt: '2024-01-01',
        username: 'testuser',
        userId: 1,
      },
    ];

    const mockResponse = {
      snippets: mockSnippets,
      meta: {
        itemsPerPage: 10,
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
      },
    };

    mockGetMySnippets.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMySnippets(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.snippets).toEqual(mockSnippets);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to fetch snippets');
    mockGetMySnippets.mockRejectedValue(error);

    const { result } = renderHook(() => useMySnippets(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.error).toBeTruthy();
      },
      { timeout: 3000 }
    );

    expect(result.current.snippets).toEqual([]);
  });

  it('should use default page and limit', async () => {
    mockGetMySnippets.mockResolvedValue({
      snippets: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useMySnippets(), { wrapper });

    await waitFor(() => {
      expect(mockGetMySnippets).toHaveBeenCalledWith(1, 15);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should update current page when setCurrentPage is called', async () => {
    mockGetMySnippets.mockResolvedValue({
      snippets: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useMySnippets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.setCurrentPage(2);

    await waitFor(() => {
      expect(mockGetMySnippets).toHaveBeenCalledWith(2, 15);
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should provide refetch function', async () => {
    mockGetMySnippets.mockResolvedValue({
      snippets: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useMySnippets(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');

    await result.current.refetch();

    expect(mockGetMySnippets).toHaveBeenCalledTimes(2);
  });
});
