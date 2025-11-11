import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { usePaginatedQuery } from '@shared/hooks/usePaginatedQuery';
import { getUsers, type UsersResponse } from '@features/users/api/userApi';
import type { UseUsersReturn } from '@features/users/types';
import type { User } from '@features/auth/types';

export const useUsers = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseUsersReturn => {
  const { items, ...rest } = usePaginatedQuery<User, UsersResponse>({
    queryKey: ['users'],
    queryFn: getUsers,
    errorMessage: 'Failed to load users',
    extractItems: response => response.users,
    initialPage,
    limit,
  });

  return {
    users: items,
    ...rest,
  };
};
