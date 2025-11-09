import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMyAccount } from '../useMyAccount';
import {
  updateUsername,
  updatePassword,
  getUserStatistics,
} from '@features/account/api/accountApi';
import { logoutUser } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type { AuthState } from '@features/auth/store/authStore';
import { useConfirmModal } from '@shared/hooks/useConfirmModal';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/account/api/accountApi');
jest.mock('@features/auth/api/authApi');
jest.mock('@features/auth/store/authStore');
jest.mock('@shared/hooks/useConfirmModal');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('react-hot-toast', () => {
  const mockToast = {
    success: jest.fn(),
    error: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockToast,
  };
});

const mockUpdateUsername = updateUsername as jest.MockedFunction<typeof updateUsername>;
const mockUpdatePassword = updatePassword as jest.MockedFunction<typeof updatePassword>;
const mockGetUserStatistics = getUserStatistics as jest.MockedFunction<typeof getUserStatistics>;
const mockLogoutUser = logoutUser as jest.MockedFunction<typeof logoutUser>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;
const mockUseConfirmModal = useConfirmModal as jest.MockedFunction<typeof useConfirmModal>;

describe('useMyAccount', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element;

  const mockUser = { id: 1, username: 'testuser', role: 'user' };
  const mockSetUser = jest.fn();
  const mockLogout = jest.fn();
  const mockShowConfirm = jest.fn();

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

    mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
      const state = {
        user: mockUser,
        isAuthenticated: true,
        isInitializing: false,
        setUser: mockSetUser,
        setInitializing: jest.fn(),
        logout: mockLogout,
      };
      return selector(state);
    });

    mockUseConfirmModal.mockReturnValue({
      showConfirm: mockShowConfirm,
      isOpen: false,
      handleConfirm: jest.fn(),
      handleCancel: jest.fn(),
      title: '',
      isLoading: false,
      setLoading: jest.fn(),
    });
  });

  describe('user statistics query', () => {
    it('should fetch user statistics', async () => {
      const mockStats = {
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      };

      mockGetUserStatistics.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(mockGetUserStatistics).toHaveBeenCalledWith(1);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.userWithStats).toEqual(mockStats);
    });

    it('should update user in store when statistics are fetched', async () => {
      const mockStats = {
        user: { id: 1, username: 'updateduser', role: 'user' },
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      };

      mockGetUserStatistics.mockResolvedValue(mockStats);

      renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockStats.user);
      });
    });
  });

  describe('handleSaveUsername', () => {
    it('should call updateUsername with trimmed username', async () => {
      const updatedUser = { id: 1, username: 'newusername', role: 'user' };
      mockUpdateUsername.mockResolvedValue(updatedUser);
      mockGetUserStatistics.mockResolvedValue({
        user: updatedUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.handleSaveUsername({ newUsername: '  newusername  ' });

      await waitFor(() => {
        expect(mockUpdateUsername).toHaveBeenCalledWith('newusername');
      });
    });

    it('should update user in store after successful username update', async () => {
      const updatedUser = { id: 1, username: 'newusername', role: 'user' };
      mockUpdateUsername.mockResolvedValue(updatedUser);
      mockGetUserStatistics.mockResolvedValue({
        user: updatedUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.handleSaveUsername({ newUsername: 'newusername' });

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalled();
      });
    });

    it('should set isSavingUsername during mutation', async () => {
      let resolvePromise: (value: typeof mockUser) => void;
      const promise = new Promise<typeof mockUser>(resolve => {
        resolvePromise = resolve;
      });

      mockUpdateUsername.mockImplementation(() => promise);
      mockGetUserStatistics.mockResolvedValue({
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.handleSaveUsername({ newUsername: 'newusername' });

      // Wait a bit for mutation to start
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isSavingUsername).toBe(true);

      resolvePromise!(mockUser);
      await waitFor(() => {
        expect(result.current.isSavingUsername).toBe(false);
      });
    });
  });

  describe('handleChangePassword', () => {
    it('should call updatePassword with password data', async () => {
      mockUpdatePassword.mockResolvedValue(undefined);
      mockGetUserStatistics.mockResolvedValue({
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.handleChangePassword({
        oldPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass',
      });

      await waitFor(() => {
        expect(mockUpdatePassword).toHaveBeenCalledWith('oldpass', 'newpass');
      });
    });

    it('should set isChangingPassword during mutation', async () => {
      let resolvePromise: () => void;
      const promise = new Promise<void>(resolve => {
        resolvePromise = resolve;
      });

      mockUpdatePassword.mockImplementation(() => promise);
      mockGetUserStatistics.mockResolvedValue({
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.handleChangePassword({
        oldPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass',
      });

      // Wait a bit for mutation to start
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isChangingPassword).toBe(true);

      resolvePromise!();
      await waitFor(() => {
        expect(result.current.isChangingPassword).toBe(false);
      });
    });
  });

  describe('handleDeleteAccount', () => {
    it('should show confirm modal before deleting account', () => {
      mockGetUserStatistics.mockResolvedValue({
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      result.current.handleDeleteAccount();

      expect(mockShowConfirm).toHaveBeenCalledWith(
        'Are you sure you want to delete your account?',
        expect.any(Function)
      );
    });
  });

  describe('handleLogout', () => {
    it('should call logoutUser and logout from store', async () => {
      mockLogoutUser.mockResolvedValue(undefined);
      mockGetUserStatistics.mockResolvedValue({
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.handleLogout();

      expect(mockLogoutUser).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
    });

    it('should logout even if logoutUser fails', async () => {
      const error = new Error('Logout failed');
      mockLogoutUser.mockRejectedValue(error);
      mockGetUserStatistics.mockResolvedValue({
        user: mockUser,
        stats: {
          rating: 100,
          snippets: 5,
          comments: 10,
          likes: 20,
          dislikes: 2,
          questions: 3,
          correctAnswers: 2,
          regularAnswers: 1,
        },
      });

      const { result } = renderHook(() => useMyAccount(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.handleLogout();

      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
