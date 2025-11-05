import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarkSnippet } from '../hooks/useMarkSnippet';
import { getSnippetById } from '../services/snippetService';
import { useAuthStore } from '../../auth/store/authStore';
import type { ApiSnippet } from '../types';
import { DEFAULT_LANGUAGE, DEFAULT_USERNAME } from '../components/SnippetCard/utils';
import CardHeader from '../components/SnippetCard/CardHeader';
import CodeSection from '../components/SnippetCard/CodeSection';
import CardFooter from '../components/SnippetCard/CardFooter';
import CommentsList from '../components/SnippetCard/CommentsList';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import Button from '../../../shared/components/Button';

export default function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markSnippet, isMarking } = useMarkSnippet();
  const currentUserId = useAuthStore(state => state.user?.id);
  const [snippet, setSnippet] = useState<ApiSnippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSnippet = async () => {
      if (!id) {
        setError('Invalid snippet ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const snippetData = await getSnippetById(parseInt(id, 10));
        setSnippet(snippetData);
        setError(null);
      } catch (err) {
        setError('Failed to load snippet');
        console.error('Failed to load snippet:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnippet();
  }, [id]);

  const handleMark = async (mark: 'like' | 'dislike') => {
    if (snippet) {
      try {
        await markSnippet({ id: parseInt(snippet.id, 10), mark });
        const updatedSnippet = await getSnippetById(parseInt(snippet.id, 10));
        setSnippet(updatedSnippet);
      } catch (err) {
        console.error('Failed to mark snippet:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
      </div>
    </>
  );
}
