import { useHomeSnippets } from '@features/home/hooks/useHomeSnippets';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';
import Pagination from '@shared/components/ui/Pagination';
import InfiniteScrollTrigger from '@shared/components/ui/InfiniteScrollTrigger';
import { useInfiniteScroll } from '@shared/hooks/useInfiniteScroll';
import { SnippetsList } from '@features/snippets';

export default function HomePage() {
  const {
    snippets,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    loadNextPage,
    hasMore,
  } = useHomeSnippets(1);

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: loadNextPage,
    hasMore,
    isLoading,
  });

  return (
    <>
      <WelcomeHeader title="Welcome to Codelang!" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        className="my-8"
      />
      <SnippetsList snippets={snippets} error={error} />
      <InfiniteScrollTrigger ref={triggerRef} isLoading={isLoading} hasMore={hasMore} />
    </>
  );
}
