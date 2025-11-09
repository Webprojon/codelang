import { useQuestions } from '@features/questions/hooks/questions';
import Pagination from '@shared/components/ui/Pagination';
import QuestionsList from '@features/questions/components/QuestionComponents/QuestionsList';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';

export default function QuestionsPage() {
  const { questions, isLoading, error, currentPage, totalPages, setCurrentPage } = useQuestions(
    1,
    10
  );

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
      <QuestionsList questions={questions} isLoading={isLoading} error={error} />
    </>
  );
}
