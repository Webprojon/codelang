import { useQuery } from '@tanstack/react-query';
import { getUserStatistics } from '../../api/userApi';
import type { UseUserStatisticsReturn } from '../../types';
import { getErrorMessage } from '../../../../shared/utils/errorHandler';
import { getDefaultQueryConfig } from '../../../../shared/hooks/useQueryConfig';

export const useUserStatistics = (userId: number): UseUserStatisticsReturn => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userStatistics', userId],
    queryFn: () => getUserStatistics(userId),
    enabled: !!userId,
    ...getDefaultQueryConfig(),
  });

  return {
    userWithStats: data,
    isLoading,
    isError,
    error: error ? getErrorMessage(error, 'Failed to load user statistics') : null,
    refetch,
  };
};
