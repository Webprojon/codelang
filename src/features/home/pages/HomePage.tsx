import { useHomeSnippets } from '@features/home/hooks/useHomeSnippets';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';
import Pagination from '@shared/components/ui/Pagination';
import { SnippetsList } from '@features/snippets';

export default function HomePage() {
  const { snippets, isLoading, error, currentPage, totalPages, setCurrentPage } =
    useHomeSnippets(1);

  return (
    <div>
      <WelcomeHeader title="Welcome to Codelang!" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        className="my-8"
      />
      <SnippetsList snippets={snippets} isLoading={isLoading} error={error} />
    </div>
  );
}
