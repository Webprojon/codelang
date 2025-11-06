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
    language: apiSnippet.language, // Keep original format from server
    createdAt: new Date().toISOString(),
    username: apiSnippet.user.username,
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
    likes,
    dislikes,
    comments: commentsCount,
    currentUserMark,
  };
};
