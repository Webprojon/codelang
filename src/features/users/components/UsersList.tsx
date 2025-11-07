import { LoadingSpinner } from '../../../shared/components/feedback';
import UserCard from './UserCard';
import type { User } from '../../auth/types';
import { Button } from '../../../shared/components/ui';

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onRefetch?: () => Promise<unknown>;
}

export default function UsersList({ users, isLoading, isError, error, onRefetch }: UsersListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <p className="text-red-500">Error: {error}</p>
        {onRefetch && (
          <Button
            onClick={() => onRefetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
