import type { ApiSnippet, ApiMark, Snippet } from '../types';

export const transformApiSnippetToSnippet = (
  apiSnippet: ApiSnippet,
  currentUserId?: number
): Snippet => {
  const likes = apiSnippet.marks.filter(mark => mark.type === 'like').length;
  const dislikes = apiSnippet.marks.filter(mark => mark.type === 'dislike').length;
  const commentsCount = apiSnippet.comments.length;

  let currentUserMark: 'like' | 'dislike' | null = null;
  if (currentUserId !== undefined) {
    const userMark = apiSnippet.marks.find(
      mark =>
        parseInt(mark.user.id, 10) === currentUserId || mark.user.id === currentUserId.toString()
    );
    if (userMark) {
      currentUserMark = userMark.type;
    }
  }

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
  const likes = apiSnippet.marks.filter((mark: ApiMark) => mark.type === 'like').length;
  const dislikes = apiSnippet.marks.filter((mark: ApiMark) => mark.type === 'dislike').length;
  const commentsCount = apiSnippet.comments.length;

  let currentUserMark: 'like' | 'dislike' | null = null;
  if (currentUserId !== undefined) {
    const userMark = apiSnippet.marks.find(
      mark =>
        parseInt(mark.user.id, 10) === currentUserId || mark.user.id === currentUserId.toString()
    );
    if (userMark) {
      currentUserMark = userMark.type;
    }
  }

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
