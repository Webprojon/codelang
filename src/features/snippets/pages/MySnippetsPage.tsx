import { useMySnippets } from '@features/snippets/hooks/snippets';
import Pagination from '@shared/components/ui/Pagination';
import InfiniteScrollTrigger from '@shared/components/ui/InfiniteScrollTrigger';
import { useInfiniteScroll } from '@shared/hooks/useInfiniteScroll';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';
import SnippetsList from '@features/snippets/components/SnippetsList';

export default function MySnippetsPage() {
  const {
    snippets,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    loadNextPage,
    hasMore,
  } = useMySnippets(1);

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: loadNextPage,
    hasMore,
    isLoading,
  });

  return (
    <div>
      <WelcomeHeader title="My Snippets!" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        className="my-8"
      />
      <SnippetsList snippets={snippets} error={error} />
      <InfiniteScrollTrigger ref={triggerRef} isLoading={isLoading} hasMore={hasMore} />
    </div>
  );
}
