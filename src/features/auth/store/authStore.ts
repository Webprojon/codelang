import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (isInitializing: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setInitializing: (isInitializing: boolean) =>
    set({
      isInitializing,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
