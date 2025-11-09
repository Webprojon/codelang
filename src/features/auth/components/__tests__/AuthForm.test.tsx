import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UseMutationResult } from '@tanstack/react-query';
import { render as customRender } from '../../../../__tests__/test-utils';
import AuthForm from '../AuthForm';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useAuthStore } from '@features/auth/store/authStore';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@features/auth/types';
import type { AuthState } from '@features/auth/store/authStore';

// Mock dependencies
jest.mock('@features/auth/hooks/useAuth');
jest.mock('@features/auth/store/authStore');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

type MockMutation<TData, TVariables> = Pick<
  UseMutationResult<TData, Error, TVariables>,
  'mutate' | 'isPending' | 'error'
>;

describe('AuthForm', () => {
  const mockLoginMutation: MockMutation<LoginResponse, LoginRequest> = {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  };

  const mockRegisterMutation: MockMutation<RegisterResponse, RegisterRequest> = {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  };

  const mockLogoutMutation: MockMutation<void, void> = {
    mutate: jest.fn(),
    isPending: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      loginMutation: mockLoginMutation as UseMutationResult<LoginResponse, Error, LoginRequest>,
      registerMutation: mockRegisterMutation as UseMutationResult<
        RegisterResponse,
        Error,
        RegisterRequest
      >,
      logoutMutation: mockLogoutMutation as UseMutationResult<void, Error, void>,
      login: mockLoginMutation.mutate,
      register: mockRegisterMutation.mutate,
      logout: mockLogoutMutation.mutate,
      isLoggingIn: false,
      isRegistering: false,
      isLoggingOut: false,
      loginError: null,
      registerError: null,
      logoutError: null,
    });

    mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
      const state: AuthState = {
        user: null,
        isAuthenticated: false,
        isInitializing: false,
        setUser: jest.fn(),
        setInitializing: jest.fn(),
        logout: jest.fn(),
      };
      return selector(state);
    });
  });

  describe('Login form', () => {
    it('should render login form correctly', () => {
      customRender(<AuthForm type="login" />);

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your Codelang account')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should not show confirm password field in login form', () => {
      customRender(<AuthForm type="login" />);

      expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
    });

    it('should validate username min length', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="login" />);

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'test');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText('Username must be longer than or equal to 5 characters')
        ).toBeInTheDocument();
      });
    });

    it('should validate password min length', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="login" />);

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, '12345');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('should validate password has letter', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="login" />);

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, '123456');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one letter')).toBeInTheDocument();
      });
    });

    it('should validate password has number', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="login" />);

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'password');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
      });
    });

    it('should call login mutation on form submit', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="login" />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLoginMutation.mutate).toHaveBeenCalledWith(
          {
            username: 'testuser',
            password: 'password123',
          },
          expect.objectContaining({})
        );
      });
    });

    it('should disable button when submitting', () => {
      mockUseAuth.mockReturnValue({
        loginMutation: { ...mockLoginMutation, isPending: true } as UseMutationResult<
          LoginResponse,
          Error,
          LoginRequest
        >,
        registerMutation: mockRegisterMutation as UseMutationResult<
          RegisterResponse,
          Error,
          RegisterRequest
        >,
        logoutMutation: mockLogoutMutation as UseMutationResult<void, Error, void>,
        login: mockLoginMutation.mutate,
        register: mockRegisterMutation.mutate,
        logout: mockLogoutMutation.mutate,
        isLoggingIn: true,
        isRegistering: false,
        isLoggingOut: false,
        loginError: null,
        registerError: null,
        logoutError: null,
      });

      customRender(<AuthForm type="login" />);

      const submitButton = screen.getByRole('button', { name: /processing.../i });
      expect(submitButton).toBeDisabled();
    });

    it('should display error message when login fails', () => {
      mockUseAuth.mockReturnValue({
        loginMutation: {
          ...mockLoginMutation,
          error: new Error('Invalid credentials'),
        } as UseMutationResult<LoginResponse, Error, LoginRequest>,
        registerMutation: mockRegisterMutation as UseMutationResult<
          RegisterResponse,
          Error,
          RegisterRequest
        >,
        logoutMutation: mockLogoutMutation as UseMutationResult<void, Error, void>,
        login: mockLoginMutation.mutate,
        register: mockRegisterMutation.mutate,
        logout: mockLogoutMutation.mutate,
        isLoggingIn: false,
        isRegistering: false,
        isLoggingOut: false,
        loginError: new Error('Invalid credentials'),
        registerError: null,
        logoutError: null,
      });

      customRender(<AuthForm type="login" />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('Register form', () => {
    it('should render register form correctly', () => {
      customRender(<AuthForm type="register" />);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Sign up to create your Codelang account')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should validate confirm password matches', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="register" />);

      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');

      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should call register mutation on form submit', async () => {
      const user = userEvent.setup();
      customRender(<AuthForm type="register" />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(usernameInput, 'newuser');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegisterMutation.mutate).toHaveBeenCalledWith(
          {
            username: 'newuser',
            password: 'password123',
          },
          expect.objectContaining({})
        );
      });
    });
  });
});
