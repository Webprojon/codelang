import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { useInfinitePaginatedQuery } from '@shared/hooks/useInfinitePaginatedQuery';
import { getUsers, type UsersResponse } from '@features/users/api/userApi';
import type { UseUsersReturn } from '@features/users/types';
import type { User } from '@features/auth/types';

export const useUsers = (
  initialPage: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): UseUsersReturn => {
  const { items, ...rest } = useInfinitePaginatedQuery<User, UsersResponse>({
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
