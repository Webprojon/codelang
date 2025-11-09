import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@features/auth/api/authApi';
import { useAuthStore } from '@features/auth/store/authStore';

export const useInitAuth = () => {
  const setUser = useAuthStore(state => state.setUser);
  const setInitializing = useAuthStore(state => state.setInitializing);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setUser(user);
        setInitializing(false);
      } else if (isError) {
        setUser(null);
        setInitializing(false);
      }
    }
  }, [user, isError, isLoading, setUser, setInitializing]);

  return {
    isLoading,
    isAuthenticated: !!user,
  };
};
