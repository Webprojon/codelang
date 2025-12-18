import { useQuestions } from '@features/questions/hooks/questions';
import Pagination from '@shared/components/ui/Pagination';
import InfiniteScrollTrigger from '@shared/components/ui/InfiniteScrollTrigger';
import { useInfiniteScroll } from '@shared/hooks/useInfiniteScroll';
import QuestionsList from '@features/questions/components/QuestionComponents/QuestionsList';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';

export default function QuestionsPage() {
  const {
    questions,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    loadNextPage,
    hasMore,
  } = useQuestions(1, 10);

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: loadNextPage,
    hasMore,
    isLoading,
  });

  return (
    <>
      <WelcomeHeader title="Questions!" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        className="my-8"
      />
      <QuestionsList questions={questions} error={error} />
      <InfiniteScrollTrigger ref={triggerRef} isLoading={isLoading} hasMore={hasMore} />
    </>
  );
}
