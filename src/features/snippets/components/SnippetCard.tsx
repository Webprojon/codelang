import { useMarkSnippet } from '../hooks/useMarkSnippet';
import type { Snippet } from '../types';
import { DEFAULT_LANGUAGE, DEFAULT_USERNAME } from './SnippetCard/utils';
import CardHeader from './SnippetCard/CardHeader';
import CodeSection from './SnippetCard/CodeSection';
import CardFooter from './SnippetCard/CardFooter';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const { markSnippet, isMarking } = useMarkSnippet();

  const username = snippet.username || DEFAULT_USERNAME;
  const language = snippet.language || DEFAULT_LANGUAGE;

  const handleMark = (mark: 'like' | 'dislike') => {
    markSnippet({ id: snippet.id, mark });
  };

  return (
    <div className="border-2 border-gray-300 text-gray-500 rounded-lg overflow-hidden">
      <CardHeader username={username} language={language} snippetId={snippet.id} />
      <CodeSection content={snippet.content} language={language} />
      <CardFooter snippet={snippet} onMark={handleMark} isMarking={isMarking} />
    </div>
  );
}
