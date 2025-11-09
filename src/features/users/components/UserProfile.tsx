import UserStatistics from '@features/users/components/UserStatistics';
import type { User } from '@features/auth/types';
import type { UserStats } from '@features/account/types';
import { getFirstLetter } from '@shared/utils/userUtils';

interface UserProfileProps {
  user: User;
  stats: UserStats;
}

export default function UserProfile({ user, stats }: UserProfileProps) {
  const firstLetter = getFirstLetter(user.username);

  return (
    <div className="rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-semibold text-4xl shrink-0">
          {firstLetter}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">{user.username}</h1>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
          <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
        </div>
      </div>

      <UserStatistics stats={stats} />
    </div>
  );
}
