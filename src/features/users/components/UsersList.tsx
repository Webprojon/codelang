import { LoadingContainer } from '@shared/components/feedback';
import UserCard from '@features/users/components/UserCard';
import type { User } from '@features/auth/types';
import Button from '@shared/components/ui/Button';

interface UsersListProps {
  users: User[];
  isError: boolean;
  error: string | null;
  onRefetch?: () => Promise<unknown>;
}

export default function UsersList({ users, isError, error, onRefetch }: UsersListProps) {
  if (isError && error) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <p className="text-red-500">Error: {error}</p>
        {onRefetch && (
          <Button onClick={() => onRefetch()} color="primary" size="md">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (users.length === 0) {
    return <LoadingContainer />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
