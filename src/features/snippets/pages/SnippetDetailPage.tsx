import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMarkSnippet } from '../hooks/useMarkSnippet';
import { useCreateComment } from '../hooks/useCreateComment';
import { getSnippetById } from '../services/snippetService';
import { useAuthStore } from '../../auth/store/authStore';
import { DEFAULT_LANGUAGE, DEFAULT_USERNAME } from '../components/SnippetCard/utils';
import CardHeader from '../components/SnippetCard/CardHeader';
import CodeSection from '../components/SnippetCard/CodeSection';
import CardFooter from '../components/SnippetCard/CardFooter';
import CommentsList from '../components/SnippetCard/CommentsList';
import CommentForm from '../components/CommentForm';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import Button from '../../../shared/components/Button';

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

  const handleMark = async (mark: 'like' | 'dislike') => {
    if (snippet && id) {
      try {
        await markSnippet({ id: parseInt(snippet.id, 10), mark });
      } catch (err) {
        console.error('Failed to mark snippet:', err);
      }
    }
  };

  const handleCommentSubmit = async (content: string) => {
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
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const error = queryError ? 'Failed to load snippet' : null;

  if (error || !snippet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600">{error || 'Snippet not found'}</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  const username = snippet.user?.username || DEFAULT_USERNAME;
  const language = snippet.language?.toLowerCase() || DEFAULT_LANGUAGE;
  const likes = snippet.marks.filter(mark => mark.type === 'like').length;
  const dislikes = snippet.marks.filter(mark => mark.type === 'dislike').length;
  const commentsCount = snippet.comments.length;

  let currentUserMark: 'like' | 'dislike' | null = null;
  if (currentUserId !== undefined) {
    const userMark = snippet.marks.find(
      mark =>
        parseInt(mark.user.id, 10) === currentUserId || mark.user.id === currentUserId.toString()
    );
    if (userMark) {
      currentUserMark = userMark.type;
    }
  }

  const isOwner = currentUserId !== undefined && parseInt(snippet.user.id, 10) === currentUserId;

  const snippetForFooter = {
    id: parseInt(snippet.id, 10),
    title: '',
    content: snippet.code,
    language,
    createdAt: new Date().toISOString(),
    username,
    likes,
    dislikes,
    comments: commentsCount,
    currentUserMark,
  };

  return (
    <>
      {isOwner && (
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => navigate(`/snippets/${snippet.id}/edit`)}
            className="px-4 py-2 bg-brand-700 text-white hover:bg-brand-500"
          >
            Edit Snippet
          </Button>
        </div>
      )}
      <div className="border-2 border-gray-300 text-gray-500 rounded-lg overflow-hidden">
        <CardHeader username={username} language={language} snippetId={parseInt(snippet.id, 10)} />
        <CodeSection content={snippet.code} language={language} />
        <CardFooter
          snippet={snippetForFooter}
          onMark={handleMark}
          isMarking={isMarking}
          onToggleComments={() => {}}
        />
      </div>
      <div className="mt-4 border-2 border-gray-300 rounded-lg overflow-hidden">
        <CommentsList comments={snippet.comments} />
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
