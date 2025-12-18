import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser, logoutUser } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@features/auth/types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async credentials => {
      const loginResponse = await loginUser(credentials);
      setUser({
        id: loginResponse.id,
        username: loginResponse.username,
        role: loginResponse.role,
      });
      return loginResponse;
    },
    mutationKey: ['login'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
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
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: error => {
      console.error('Logout error:', error);
      logout();
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
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
