import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { loginUser, registerUser, logoutUser } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type { AuthState } from '@features/auth/store/authStore';
import type { ReactNode } from 'react';

// Mock dependencies
jest.mock('@features/auth/api/authApi');
jest.mock('@features/auth/store/authStore');

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;
const mockLogoutUser = logoutUser as jest.MockedFunction<typeof logoutUser>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('useAuth', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => React.JSX.Element;

  const mockSetUser = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
      const state = {
        user: null,
        isAuthenticated: false,
        isInitializing: false,
        setUser: mockSetUser,
        setInitializing: jest.fn(),
        logout: mockLogout,
      };
      return selector(state);
    });
  });

  describe('loginMutation', () => {
    it('should call loginUser with credentials', async () => {
      const mockUser = { id: 1, username: 'testuser', role: 'user' };
      mockLoginUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password123' });

      await waitFor(() => {
        expect(mockLoginUser).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123',
        });
      });
    });

    it('should set user after successful login', async () => {
      const mockUser = { id: 1, username: 'testuser', role: 'user' };
      mockLoginUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password123' });

      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith({
          id: mockUser.id,
          username: mockUser.username,
          role: mockUser.role,
        });
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      mockLoginUser.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'wrongpass' });

      await waitFor(() => {
        expect(result.current.loginError).toBeTruthy();
      });
    });

    it('should set isLoggingIn to true during login', async () => {
      const mockUser = { id: 1, username: 'test', role: 'user' };
      let resolvePromise: (value: typeof mockUser) => void;
      const promise = new Promise<typeof mockUser>(resolve => {
        resolvePromise = resolve;
      });

      mockLoginUser.mockImplementation(() => promise);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ username: 'testuser', password: 'password123' });

      // Wait a bit for mutation to start
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isLoggingIn).toBe(true);

      resolvePromise!(mockUser);
      await waitFor(() => {
        expect(result.current.isLoggingIn).toBe(false);
      });
    });
  });

  describe('registerMutation', () => {
    it('should call registerUser with credentials', async () => {
      const mockResponse = { id: 1, username: 'newuser', role: 'user' };
      mockRegisterUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({ username: 'newuser', password: 'password123' });

      await waitFor(() => {
        expect(mockRegisterUser).toHaveBeenCalledWith({
          username: 'newuser',
          password: 'password123',
        });
      });
    });

    it('should handle register error', async () => {
      const error = new Error('Username already exists');
      mockRegisterUser.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({ username: 'existinguser', password: 'password123' });

      await waitFor(() => {
        expect(result.current.registerError).toBeTruthy();
      });
    });

    it('should set isRegistering to true during registration', async () => {
      const mockUser = { id: 1, username: 'test', role: 'user' };
      let resolvePromise: (value: typeof mockUser) => void;
      const promise = new Promise<typeof mockUser>(resolve => {
        resolvePromise = resolve;
      });

      mockRegisterUser.mockImplementation(() => promise);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({ username: 'newuser', password: 'password123' });

      // Wait a bit for mutation to start
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isRegistering).toBe(true);

      resolvePromise!(mockUser);
      await waitFor(() => {
        expect(result.current.isRegistering).toBe(false);
      });
    });
  });

  describe('logoutMutation', () => {
    it('should call logoutUser and clear user state', async () => {
      mockLogoutUser.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      await waitFor(() => {
        expect(mockLogoutUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });

    it('should handle logout error and still clear user state', async () => {
      const error = new Error('Logout failed');
      mockLogoutUser.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
      });
    });

    it('should set isLoggingOut to true during logout', async () => {
      let resolvePromise: () => void;
      const promise = new Promise<void>(resolve => {
        resolvePromise = resolve;
      });

      mockLogoutUser.mockImplementation(() => promise);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.logout();

      // Wait a bit for mutation to start
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(result.current.isLoggingOut).toBe(true);

      resolvePromise!();
      await waitFor(() => {
        expect(result.current.isLoggingOut).toBe(false);
      });
    });
  });
});
