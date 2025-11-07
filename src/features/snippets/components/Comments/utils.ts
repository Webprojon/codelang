import type { ApiComment } from '../../types';

export const sortCommentsById = (comments: ApiComment[]): ApiComment[] => {
  return [...comments].sort((a, b) => {
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    return idA - idB;
  });
};

export const isCommentOwner = (comment: ApiComment, currentUserId?: number): boolean => {
  if (!currentUserId) return false;
  return (
    comment.user.id === currentUserId.toString() || parseInt(comment.user.id, 10) === currentUserId
  );
};
