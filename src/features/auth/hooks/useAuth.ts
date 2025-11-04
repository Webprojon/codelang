import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore(state => state.logout);

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    mutationKey: ['login'],
  });

  const registerMutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerUser,
    mutationKey: ['register'],
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: logoutUser,
    mutationKey: ['logout'],
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: error => {
      console.error('Logout error:', error);
      logout();
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
};
