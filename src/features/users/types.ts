import type { User } from '@features/auth/types';
import type { UserStats } from '@features/account/types';

export interface UserWithStats {
  user: User;
  stats: UserStats;
}

// Hook Return Types
export interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  loadNextPage: () => void;
  hasMore: boolean;
  refetch: () => Promise<unknown>;
}

export interface UseUserStatisticsReturn {
  userWithStats: UserWithStats | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}
