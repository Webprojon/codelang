import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMarkSnippet } from '@features/snippets/hooks/useMarkSnippet';
import { useCreateComment } from '@features/snippets/hooks/comments';
import { getSnippetById } from '@features/snippets/api/snippetApi';
import { useAuthStore } from '@features/auth/store/authStore';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_USERNAME,
} from '@features/snippets/components/SnippetCard/utils';
import { createSnippetForFooter } from '@features/snippets/utils/snippetUtils';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import { MarkType } from '@features/snippets/types';
import CardHeader from '@features/snippets/components/SnippetCard/CardHeader';
import CodeSection from '@features/snippets/components/SnippetCard/CodeSection';
import CardFooter from '@features/snippets/components/SnippetCard/CardFooter';
import CommentsList from '@features/snippets/components/Comments/CommentsList';
import CommentForm from '@features/snippets/components/CommentForm';
import { LoadingSpinner } from '@shared/components/feedback';
import Button from '@shared/components/ui/Button';

export default function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markSnippet, isMarking } = useMarkSnippet();
  const currentUserId = useAuthStore(state => state.user?.id);

  const {
    data: snippet,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['snippet', id ? parseInt(id, 10) : null],
    queryFn: () => getSnippetById(parseInt(id!, 10)),
    enabled: !!id,
  });

  const {
    createComment: createCommentHandler,
    isSubmitting: isCommentSubmitting,
    error: commentError,
  } = useCreateComment();

  const handleMark = useCallback(
    async (mark: MarkType) => {
      if (snippet && id) {
        try {
          await markSnippet({ id: parseInt(snippet.id, 10), mark });
        } catch (err) {
          console.error('Failed to mark snippet:', err);
        }
      }
    },
    [snippet, id, markSnippet]
  );

  const handleCommentSubmit = useCallback(
    async (content: string) => {
      if (!snippet || !id) {
        return;
      }

      try {
        await createCommentHandler({
          content,
          snippetId: parseInt(id, 10),
        });
      } catch (err) {
        console.error('Failed to create comment:', err);
        throw err;
      }
    },
    [snippet, id, createCommentHandler]
  );

  const username = snippet?.user?.username || DEFAULT_USERNAME;
  const language = snippet?.language || DEFAULT_LANGUAGE;
  const snippetForFooter = useMemo(
    () => (snippet ? createSnippetForFooter(snippet, currentUserId) : null),
    [snippet, currentUserId]
  );

  if (isLoading) {
    return (
      <div className={SNIPPET_STYLES.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const error = queryError ? 'Failed to load snippet' : null;

  if (error || !snippet) {
    return (
      <div className={SNIPPET_STYLES.errorContainer}>
        <p className="text-red-600">{error || 'Snippet not found'}</p>
        <Button onClick={() => navigate('/')} color="primary" size="md">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={SNIPPET_STYLES.card}>
        <CardHeader
          username={username}
          language={language}
          snippetId={parseInt(snippet.id, 10)}
          userId={parseInt(snippet.user.id, 10)}
        />
        <CodeSection content={snippet.code} language={language} />
        <CardFooter
          snippet={snippetForFooter!}
          onMark={handleMark}
          isMarking={isMarking}
          onToggleComments={() => {}}
        />
      </div>
      <div className={`mt-4 ${SNIPPET_STYLES.card}`}>
        <CommentsList
          comments={snippet.comments}
          currentUserId={currentUserId}
          snippetId={parseInt(snippet.id, 10)}
        />
        {currentUserId !== undefined && (
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={isCommentSubmitting}
            error={commentError}
          />
        )}
      </div>
    </>
  );
}
