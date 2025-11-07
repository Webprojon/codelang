import { useMySnippets } from '../hooks/useMySnippets';
import { Pagination, WelcomeHeader } from '../../../shared/components/ui';
import SnippetsList from '../components/SnippetsList';

export default function MySnippetsPage() {
  const { snippets, isLoading, error, currentPage, totalPages, setCurrentPage } = useMySnippets(1);

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
      <SnippetsList snippets={snippets} isLoading={isLoading} error={error} showActions={true} />
    </div>
  );
}
