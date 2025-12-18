import type { ApiComment } from '@features/snippets/types';
import { ConfirmModal } from '@shared/components/feedback';
import CommentItem from '@features/snippets/components/Comments/CommentItem';
import CommentsEmptyState from '@features/snippets/components/Comments/CommentsEmptyState';
import { sortCommentsById, isCommentOwner } from '@features/snippets/components/Comments/utils';
import { useCommentHandlers } from '@features/snippets/hooks/comments';

interface CommentsListProps {
  comments: ApiComment[];
  currentUserId?: number;
  snippetId: number;
}

export default function CommentsList({ comments, currentUserId, snippetId }: CommentsListProps) {
  const {
    handleEditClick,
    handleDelete,
    handleSaveEdit,
    handleCancelEdit,
    handleEditContentChange,
    confirmModal,
    isUpdating,
    isDeleting,
  } = useCommentHandlers({ snippetId });
  const sortedComments = sortCommentsById(comments);

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
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={isOwner}
                onEditClick={handleEditClick}
                onDeleteClick={handleDelete}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onEditContentChange={handleEditContentChange}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
              />
            );
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
