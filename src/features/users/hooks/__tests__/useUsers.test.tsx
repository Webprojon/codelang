import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '../useUsers';
import { getUsers } from '@features/users/api/userApi';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/users/api/userApi');

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

describe('useUsers', () => {
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

  it('should return users data on successful fetch', async () => {
    const mockUsers = [
      { id: 1, username: 'user1', role: 'user' },
      { id: 2, username: 'user2', role: 'user' },
    ];

    const mockResponse = {
      users: mockUsers,
      meta: {
        itemsPerPage: 10,
        totalItems: 2,
        currentPage: 1,
        totalPages: 1,
      },
    };

    mockGetUsers.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUsers(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to fetch users');
    mockGetUsers.mockRejectedValue(error);

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.error).toBeTruthy();
      },
      { timeout: 3000 }
    );

    expect(result.current.users).toEqual([]);
  });

  it('should use default page and limit', async () => {
    mockGetUsers.mockResolvedValue({
      users: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(mockGetUsers).toHaveBeenCalledWith(1, 15);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should update current page when setCurrentPage is called', async () => {
    mockGetUsers.mockResolvedValue({
      users: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.setCurrentPage(2);

    await waitFor(() => {
      expect(mockGetUsers).toHaveBeenCalledWith(2, 15);
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should provide refetch function', async () => {
    mockGetUsers.mockResolvedValue({
      users: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');

    await result.current.refetch();

    expect(mockGetUsers).toHaveBeenCalledTimes(2);
  });
});
