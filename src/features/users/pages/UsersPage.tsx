import { useUsers } from '@features/users/hooks/useUsers';
import UsersList from '@features/users/components/UsersList';
import Pagination from '@shared/components/ui/Pagination';
import InfiniteScrollTrigger from '@shared/components/ui/InfiniteScrollTrigger';
import { useInfiniteScroll } from '@shared/hooks/useInfiniteScroll';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';

export default function UsersPage() {
  const {
    users,
    isLoading,
    isError,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    loadNextPage,
    hasMore,
    refetch,
  } = useUsers(1);

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: loadNextPage,
    hasMore,
    isLoading,
  });

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
      <UsersList users={users} isError={isError} error={error} onRefetch={refetch} />
      <InfiniteScrollTrigger ref={triggerRef} isLoading={isLoading} hasMore={hasMore} />
    </div>
  );
}
