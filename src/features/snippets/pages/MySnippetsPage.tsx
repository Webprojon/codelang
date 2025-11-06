import { useMySnippets } from '../hooks/useMySnippets';
import PaginationControls from '../../home/components/PaginationControls';
import SnippetsList from '../../home/components/SnippetsList';
import WelcomeHeader from '../../home/components/WelcomeHeader';

export default function MySnippetsPage() {
  const { snippets, isLoading, error, currentPage, totalPages, setCurrentPage } = useMySnippets(1);

  return (
    <div>
      <WelcomeHeader title="My Snippets!" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
      />
      <SnippetsList snippets={snippets} isLoading={isLoading} error={error} showActions={true} />
    </div>
  );
}
