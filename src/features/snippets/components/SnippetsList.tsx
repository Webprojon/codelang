import SnippetCard from '@features/snippets/components/SnippetCard';
import type { Snippet } from '@features/snippets/types';
import { LoadingContainer } from '@shared/components/feedback';

interface SnippetsListProps {
  snippets: Snippet[];
  error: string | null;
}

export default function SnippetsList({ snippets, error }: SnippetsListProps) {
  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (snippets.length === 0) {
    return <LoadingContainer />;
  }

  return (
    <div className="space-y-8">
      {snippets.map(snippet => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
