import type { ApiSnippet, Snippet } from '../types';
import { MarkType } from '../types';

interface SnippetMetrics {
  likes: number;
  dislikes: number;
  commentsCount: number;
  currentUserMark: MarkType | null;
}

const calculateSnippetMetrics = (
  apiSnippet: ApiSnippet,
  currentUserId?: number
): SnippetMetrics => {
  const likes = apiSnippet.marks.filter(mark => mark.type === MarkType.LIKE).length;
  const dislikes = apiSnippet.marks.filter(mark => mark.type === MarkType.DISLIKE).length;
  const commentsCount = apiSnippet.comments.length;

  let currentUserMark: MarkType | null = null;
  if (currentUserId !== undefined) {
    const userMark = apiSnippet.marks.find(
      mark =>
        parseInt(mark.user.id, 10) === currentUserId || mark.user.id === currentUserId.toString()
    );
    if (userMark) {
      currentUserMark = userMark.type;
    }
  }

  return { likes, dislikes, commentsCount, currentUserMark };
};

export const transformApiSnippetToSnippet = (
  apiSnippet: ApiSnippet,
  currentUserId?: number
): Snippet => {
  const { likes, dislikes, commentsCount, currentUserMark } = calculateSnippetMetrics(
    apiSnippet,
    currentUserId
  );

  return {
    id: parseInt(apiSnippet.id, 10),
    title: '',
    content: apiSnippet.code,
    language: apiSnippet.language,
    createdAt: new Date().toISOString(),
    username: apiSnippet.user.username,
    userId: parseInt(apiSnippet.user.id, 10),
    likes,
    dislikes,
    comments: commentsCount,
    currentUserMark,
  };
};

export const createSnippetForFooter = (apiSnippet: ApiSnippet, currentUserId?: number): Snippet => {
  const { likes, dislikes, commentsCount, currentUserMark } = calculateSnippetMetrics(
    apiSnippet,
    currentUserId
  );

  return {
    id: parseInt(apiSnippet.id, 10),
    title: '',
    content: apiSnippet.code,
    language: apiSnippet.language || 'JavaScript',
    createdAt: new Date().toISOString(),
    username: apiSnippet.user?.username || 'Anonymous',
    userId: apiSnippet.user ? parseInt(apiSnippet.user.id, 10) : undefined,
    likes,
    dislikes,
    comments: commentsCount,
    currentUserMark,
  };
};
