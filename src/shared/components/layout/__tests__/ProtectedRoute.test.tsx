import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuthStore } from '@features/auth/store/authStore';
import type { AuthState } from '@features/auth/store/authStore';

// Mock auth store
jest.mock('@features/auth/store/authStore');
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is authenticated', () => {
    it('should render Outlet for protected routes', () => {
      mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
        const state: AuthState = {
          user: { id: 1, username: 'test', role: 'user' },
          isAuthenticated: true,
          isInitializing: false,
          setUser: jest.fn(),
          setInitializing: jest.fn(),
          logout: jest.fn(),
        };
        return selector(state);
      });

      render(
        <MemoryRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect authenticated user from reverse routes', () => {
      mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
        const state: AuthState = {
          user: { id: 1, username: 'test', role: 'user' },
          isAuthenticated: true,
          isInitializing: false,
          setUser: jest.fn(),
          setInitializing: jest.fn(),
          logout: jest.fn(),
        };
        return selector(state);
      });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<ProtectedRoute reverse redirectTo="/" />}>
              <Route path="/login" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Should redirect, so TestComponent should not be visible
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('when user is not authenticated', () => {
    it('should redirect unauthenticated user from protected routes', () => {
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

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute redirectTo="/login" />}>
              <Route path="/protected" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Should redirect, so TestComponent should not be visible
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render Outlet for reverse routes when not authenticated', () => {
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

      render(
        <MemoryRouter>
          <Routes>
            <Route element={<ProtectedRoute reverse />}>
              <Route path="/" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('when initializing', () => {
    it('should return null while initializing', () => {
      mockUseAuthStore.mockImplementation((selector: (state: AuthState) => unknown) => {
        const state: AuthState = {
          user: null,
          isAuthenticated: false,
          isInitializing: true,
          setUser: jest.fn(),
          setInitializing: jest.fn(),
          logout: jest.fn(),
        };
        return selector(state);
      });

      const { container } = render(
        <MemoryRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
