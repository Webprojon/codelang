import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, DEFAULT_PAGE, DEFAULT_LIMIT } from '../api/userApi';
import { getErrorMessage } from '../../../shared/utils/errorHandler';
import { getDefaultQueryConfig } from '../../../shared/hooks/useQueryConfig';
import type { User } from '../../auth/types';

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<unknown>;
}

export const useUsers = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseUsersReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', currentPage, limit],
    queryFn: () => getUsers(currentPage, limit),
    ...getDefaultQueryConfig({ staleTime: 0 }),
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
