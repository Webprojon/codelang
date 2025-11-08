import { useMarkSnippet } from '../hooks/useMarkSnippet';
import type { Snippet } from '../types';
import { MarkType } from '../types';
import { DEFAULT_LANGUAGE, DEFAULT_USERNAME } from './SnippetCard/utils';
import { SNIPPET_STYLES } from '../utils/styles';
import CardHeader from './SnippetCard/CardHeader';
import CodeSection from './SnippetCard/CodeSection';
import CardFooter from './SnippetCard/CardFooter';

interface SnippetCardProps {
  snippet: Snippet;
  showActions?: boolean;
}

export default function SnippetCard({ snippet, showActions = false }: SnippetCardProps) {
  const { markSnippet, isMarking } = useMarkSnippet();

  const username = snippet.username || DEFAULT_USERNAME;
  const language = snippet.language || DEFAULT_LANGUAGE;

  const handleMark = (mark: MarkType) => {
    markSnippet({ id: snippet.id, mark });
  };

  return (
    <div className={SNIPPET_STYLES.card}>
      <CardHeader
        username={username}
        language={language}
        snippetId={snippet.id}
        userId={snippet.userId}
        showActions={showActions}
      />
      <CodeSection content={snippet.content} language={language} />
      <CardFooter snippet={snippet} onMark={handleMark} isMarking={isMarking} />
    </div>
  );
}
