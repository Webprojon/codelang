import { useMemo } from 'react';
import type { ApiComment } from '../../types';
import { ConfirmModal } from '../../../../shared/components/feedback';
import CommentItem from './CommentItem';
import CommentsEmptyState from './CommentsEmptyState';
import { sortCommentsById, isCommentOwner } from './utils';
import { useCommentHandlers } from '../../hooks/comments';

interface CommentsListProps {
  comments: ApiComment[];
  currentUserId?: number;
  snippetId: number;
}

export default function CommentsList({ comments, currentUserId, snippetId }: CommentsListProps) {
  const { confirmModal } = useCommentHandlers({ comments, snippetId });
  const sortedComments = useMemo(() => sortCommentsById(comments), [comments]);

  if (sortedComments.length === 0) {
    return <CommentsEmptyState />;
  }

  return (
    <>
      <div className="bg-gray-50">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Comments ({sortedComments.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedComments.map(comment => {
            const isOwner = isCommentOwner(comment, currentUserId);
            return <CommentItem key={comment.id} comment={comment} isOwner={isOwner} />;
          })}
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        onConfirm={confirmModal.handleConfirm}
        onCancel={confirmModal.handleCancel}
        isLoading={confirmModal.isLoading}
      />
    </>
  );
}
