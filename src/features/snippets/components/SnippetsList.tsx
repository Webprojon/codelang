import SnippetCard from './SnippetCard';
import { LoadingSpinner } from '../../../shared/components/feedback';
import type { Snippet } from '../types';

interface SnippetsListProps {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
}

export default function SnippetsList({ snippets, isLoading, error }: SnippetsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">No snippets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {snippets.map(snippet => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
