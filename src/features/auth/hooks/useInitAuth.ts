import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type { User } from '@features/auth/types';

export const useInitAuth = () => {
  const setUser = useAuthStore(state => state.setUser);
  const setInitializing = useAuthStore(state => state.setInitializing);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
    onSettled: (data: User | undefined) => {
      setUser(data || null);
      setInitializing(false);
    },
  });

  return {
    isLoading,
    isAuthenticated: !!user,
  };
};
