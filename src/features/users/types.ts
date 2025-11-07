import type { User } from '../auth/types';
import type { UserStats } from '../account/types';

export interface UserWithStats {
  user: User;
  stats: UserStats;
}
