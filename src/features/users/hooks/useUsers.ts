import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@features/users/api/userApi';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type { UseUsersReturn } from '@features/users/types';
import { getErrorMessage } from '@shared/utils/errorHandler';
import { getDefaultQueryConfig } from '@shared/hooks/useQueryConfig';

export const useUsers = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseUsersReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', currentPage, limit],
    queryFn: () => getUsers(currentPage, limit),
    ...getDefaultQueryConfig({
      staleTime: 2 * 60 * 1000,
      refetchOnMount: false,
    }),
  });

  return {
    users: data?.users || [],
    isLoading,
    isError,
    error: error ? getErrorMessage(error, 'Failed to load users') : null,
    currentPage,
    totalPages: data?.meta.totalPages || 1,
    setCurrentPage,
    refetch,
  };
};
