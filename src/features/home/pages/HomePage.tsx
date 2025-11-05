import { useHomeSnippets } from '../';
import WelcomeHeader from '../components/WelcomeHeader';
import PaginationControls from '../components/PaginationControls';
import SnippetsList from '../components/SnippetsList';

export default function HomePage() {
  const { snippets, isLoading, error, currentPage, totalPages, setCurrentPage } =
    useHomeSnippets(1);

  return (
    <div>
      <WelcomeHeader />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
      />
      <SnippetsList snippets={snippets} isLoading={isLoading} error={error} />
    </div>
  );
}
