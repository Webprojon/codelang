import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateSnippet } from '../snippets/useCreateSnippet';
import { createSnippet } from '@features/snippets/api/snippetApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type { AuthState } from '@features/auth/store/authStore';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/snippets/api/snippetApi');
jest.mock('@features/auth/store/authStore');
jest.mock('@shared/utils/queryUtils', () => ({
  invalidateSnippetQueries: jest.fn().mockResolvedValue(undefined),
}));

const mockCreateSnippet = createSnippet as jest.MockedFunction<typeof createSnippet>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('useCreateSnippet', () => {
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

    mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
      const state = {
        user: { id: 1, username: 'testuser', role: 'user' },
        isAuthenticated: true,
        isInitializing: false,
        setUser: jest.fn(),
        setInitializing: jest.fn(),
        logout: jest.fn(),
      };
      return selector(state);
    });
  });

  it('should call createSnippet with request data', async () => {
    mockCreateSnippet.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateSnippet(), { wrapper });

    const request = {
      code: 'const test = "code";',
      language: 'JavaScript',
    };

    await result.current.createSnippet(request);

    expect(mockCreateSnippet).toHaveBeenCalledWith(request);
  });

  it('should set isSubmitting to true during mutation', async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>(resolve => {
      resolvePromise = resolve;
    });

    mockCreateSnippet.mockImplementation(() => promise);

    const { result } = renderHook(() => useCreateSnippet(), { wrapper });

    const request = {
      code: 'const test = "code";',
      language: 'JavaScript',
    };

    const mutationPromise = result.current.createSnippet(request);

    // Wait a bit for mutation to start
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(result.current.isSubmitting).toBe(true);

    resolvePromise!();
    await mutationPromise;

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('should handle error on create snippet failure', async () => {
    const error = new Error('Failed to create snippet');
    mockCreateSnippet.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateSnippet(), { wrapper });

    const request = {
      code: 'const test = "code";',
      language: 'JavaScript',
    };

    await expect(result.current.createSnippet(request)).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('should clear error on successful creation', async () => {
    mockCreateSnippet.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateSnippet(), { wrapper });

    const request = {
      code: 'const test = "code";',
      language: 'JavaScript',
    };

    await result.current.createSnippet(request);

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
