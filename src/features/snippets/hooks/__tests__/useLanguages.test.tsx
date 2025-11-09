import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLanguages } from '../useLanguages';
import { getLanguages } from '@features/snippets/api/snippetApi';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/snippets/api/snippetApi');

const mockGetLanguages = getLanguages as jest.MockedFunction<typeof getLanguages>;

describe('useLanguages', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it('should return languages data on successful fetch', async () => {
    const mockLanguages = ['JavaScript', 'Python', 'Java', 'C++'];

    mockGetLanguages.mockResolvedValue(mockLanguages);

    const { result } = renderHook(() => useLanguages(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.languages).toEqual(mockLanguages);
    expect(result.current.error).toBeNull();
  });

  it('should return empty array when data is undefined', async () => {
    mockGetLanguages.mockResolvedValue(undefined as unknown as string[]);

    const { result } = renderHook(() => useLanguages(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.languages).toEqual([]);
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to fetch languages');
    mockGetLanguages.mockRejectedValue(error);

    const { result } = renderHook(() => useLanguages(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.languages).toEqual([]);
  });

  it('should cache languages data', async () => {
    const mockLanguages = ['JavaScript', 'Python'];

    mockGetLanguages.mockResolvedValue(mockLanguages);

    const { result, rerender } = renderHook(() => useLanguages(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetLanguages).toHaveBeenCalledTimes(1);

    rerender();

    // Should use cached data, not fetch again immediately
    expect(mockGetLanguages).toHaveBeenCalledTimes(1);
  });
});
