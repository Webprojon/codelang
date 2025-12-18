import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuestions } from '../questions/useQuestions';
import { getQuestions } from '@features/questions/api/questionsApi';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/questions/api/questionsApi');

const mockGetQuestions = getQuestions as jest.MockedFunction<typeof getQuestions>;

describe('useQuestions', () => {
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

  it('should return questions data on successful fetch', async () => {
    const mockQuestions = [
      {
        id: 1,
        title: 'Test Question',
        description: 'Test Description',
        user: { id: 1, username: 'testuser', role: 'user' },
        answers: [],
        isResolved: false,
      },
    ];

    const mockResponse = {
      questions: mockQuestions,
      meta: {
        itemsPerPage: 10,
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
      },
    };

    mockGetQuestions.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useQuestions(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to fetch questions');
    mockGetQuestions.mockRejectedValue(error);

    const { result } = renderHook(() => useQuestions(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.error).toBeTruthy();
      },
      { timeout: 3000 }
    );

    expect(result.current.questions).toEqual([]);
  });

  it('should use default page and limit', async () => {
    mockGetQuestions.mockResolvedValue({
      questions: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useQuestions(), { wrapper });

    await waitFor(() => {
      expect(mockGetQuestions).toHaveBeenCalledWith(1, 15);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should use custom initial page', async () => {
    mockGetQuestions.mockResolvedValue({
      questions: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 2,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useQuestions(2), { wrapper });

    await waitFor(() => {
      expect(mockGetQuestions).toHaveBeenCalledWith(2, 15);
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should update current page when setCurrentPage is called', async () => {
    mockGetQuestions.mockResolvedValue({
      questions: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useQuestions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.setCurrentPage(2);

    await waitFor(() => {
      expect(mockGetQuestions).toHaveBeenCalledWith(2, 15);
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should return empty array when data is undefined', async () => {
    mockGetQuestions.mockResolvedValue({
      questions: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useQuestions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.questions).toEqual([]);
  });

  it('should provide refetch function', async () => {
    mockGetQuestions.mockResolvedValue({
      questions: [],
      meta: {
        itemsPerPage: 10,
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const { result } = renderHook(() => useQuestions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');

    await result.current.refetch();

    expect(mockGetQuestions).toHaveBeenCalledTimes(2);
  });
});
