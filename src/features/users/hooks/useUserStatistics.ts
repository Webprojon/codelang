import { useQuery } from '@tanstack/react-query';
import { getUserStatistics } from '@features/users/api/userApi';
import type { UseUserStatisticsReturn } from '@features/users/types';
import { getErrorMessage } from '@shared/utils/errorHandler';

export const useUserStatistics = (userId: number): UseUserStatisticsReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userStatistics', userId],
    queryFn: () => getUserStatistics(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    userWithStats: data,
    isLoading,
    isError,
    error: error ? getErrorMessage(error, 'Failed to load user statistics') : null,
    refetch,
  };
};
