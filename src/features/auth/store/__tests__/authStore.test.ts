import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import type { User } from '@features/auth/types';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(null);
      result.current.setInitializing(true);
    });
  });

  describe('setUser', () => {
    it('should set user and update isAuthenticated to true', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set user to null and update isAuthenticated to false', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
      };

      // First set a user
      act(() => {
        result.current.setUser(mockUser);
      });

      // Then set to null
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user and set isAuthenticated to false', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        role: 'user',
      };

      // Set user first
      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setInitializing', () => {
    it('should update isInitializing state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setInitializing(false);
      });

      expect(result.current.isInitializing).toBe(false);

      act(() => {
        result.current.setInitializing(true);
      });

      expect(result.current.isInitializing).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('should be computed correctly based on user presence', () => {
      const { result } = renderHook(() => useAuthStore());

      // Initially false
      expect(result.current.isAuthenticated).toBe(false);

      // Set user
      act(() => {
        result.current.setUser({
          id: 1,
          username: 'testuser',
          role: 'user',
        });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Clear user
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
