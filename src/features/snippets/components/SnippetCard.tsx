import { useMarkSnippet } from '@features/snippets/hooks/useMarkSnippet';
import type { Snippet } from '@features/snippets/types';
import { MarkType } from '@features/snippets/types';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_USERNAME,
} from '@features/snippets/components/SnippetCard/utils';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import CardHeader from '@features/snippets/components/SnippetCard/CardHeader';
import CodeSection from '@features/snippets/components/SnippetCard/CodeSection';
import CardFooter from '@features/snippets/components/SnippetCard/CardFooter';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
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
      />
      <CodeSection content={snippet.content} language={language} />
      <CardFooter snippet={snippet} onMark={handleMark} isMarking={isMarking} />
    </div>
  );
}
