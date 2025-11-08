import { useUsers } from '../hooks/useUsers';
import UsersList from '../components/UsersList';
import Pagination from '@shared/components/ui/Pagination';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';

export default function UsersPage() {
  const { users, isLoading, isError, error, currentPage, totalPages, setCurrentPage, refetch } =
    useUsers(1);

  return (
    <div className="min-h-screen">
      <WelcomeHeader title="Active users!" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        className="my-8"
      />
      <UsersList
        users={users}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRefetch={refetch}
      />
    </div>
  );
}
