import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateQuestion } from '../questions/useCreateQuestion';
import { createQuestion } from '@features/questions/api/questionsApi';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/questions/api/questionsApi');
jest.mock('@features/questions/utils/queryUtils', () => ({
  invalidateQuestionQueries: jest.fn().mockResolvedValue(undefined),
}));

const mockCreateQuestion = createQuestion as jest.MockedFunction<typeof createQuestion>;

describe('useCreateQuestion', () => {
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

  it('should call createQuestion with request data', async () => {
    const mockQuestion = {
      id: 1,
      title: 'New Question',
      description: 'Question Description',
      user: { id: 1, username: 'testuser', role: 'user' },
      answers: [],
      isResolved: false,
    };

    mockCreateQuestion.mockResolvedValue(mockQuestion);

    const { result } = renderHook(() => useCreateQuestion(), { wrapper });

    const request = {
      title: 'New Question',
      description: 'Question Description',
      attachedCode: '',
    };

    await result.current.createQuestion(request);

    expect(mockCreateQuestion).toHaveBeenCalledWith(request, expect.objectContaining({}));
  });

  it('should set isSubmitting to true during mutation', async () => {
    const mockQuestion = {
      id: 1,
      title: 'Test',
      description: 'Test',
      user: { id: 1, username: 'test', role: 'user' },
      answers: [],
      isResolved: false,
    };
    let resolvePromise: (value: typeof mockQuestion) => void;
    const promise = new Promise<typeof mockQuestion>(resolve => {
      resolvePromise = resolve;
    });

    mockCreateQuestion.mockImplementation(() => promise);

    const { result } = renderHook(() => useCreateQuestion(), { wrapper });

    const request = {
      title: 'New Question',
      description: 'Question Description',
      attachedCode: '',
    };

    const mutationPromise = result.current.createQuestion(request);

    // Wait a bit for mutation to start
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(result.current.isSubmitting).toBe(true);

    resolvePromise!(mockQuestion);
    await mutationPromise;

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('should handle error on create question failure', async () => {
    const error = new Error('Failed to create question');
    mockCreateQuestion.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateQuestion(), { wrapper });

    const request = {
      title: 'New Question',
      description: 'Question Description',
      attachedCode: '',
    };

    await expect(result.current.createQuestion(request)).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('should clear error on successful creation', async () => {
    const mockQuestion = {
      id: 1,
      title: 'New Question',
      description: 'Question Description',
      user: { id: 1, username: 'testuser', role: 'user' },
      answers: [],
      isResolved: false,
    };

    mockCreateQuestion.mockResolvedValue(mockQuestion);

    const { result } = renderHook(() => useCreateQuestion(), { wrapper });

    const request = {
      title: 'New Question',
      description: 'Question Description',
      attachedCode: '',
    };

    await result.current.createQuestion(request);

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
