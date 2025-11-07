import { useState, useMemo } from 'react';
import type { ApiComment } from '../../types';
import { useUpdateComment } from '../../hooks/useUpdateComment';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import toast from 'react-hot-toast';
import { useConfirmModal } from '../../../../shared/hooks/useConfirmModal';
import { ConfirmModal } from '../../../../shared/components/feedback';
import CommentItem from './CommentItem';
import CommentsEmptyState from './CommentsEmptyState';
import { sortCommentsById, isCommentOwner } from './utils';

interface CommentsListProps {
  comments: ApiComment[];
  currentUserId?: number;
  snippetId: number;
}

export default function CommentsList({ comments, currentUserId, snippetId }: CommentsListProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { updateComment, isUpdating } = useUpdateComment(snippetId);
  const { deleteComment, isDeleting } = useDeleteComment(snippetId);
  const confirmModal = useConfirmModal();

  const handleEditClick = (comment: ApiComment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await updateComment(parseInt(commentId, 10), { content: editContent });
      toast.success('Comment updated successfully');
      setEditingCommentId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    confirmModal.showConfirm('Are you sure you want to delete this comment?', async () => {
      try {
        await deleteComment(parseInt(commentId, 10));
        toast.success('Comment deleted successfully');
      } catch (error) {
        console.error('Failed to delete comment:', error);
        toast.error('Failed to delete comment');
      }
    });
  };

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
            const isEditing = editingCommentId === comment.id;

            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={isOwner}
                isEditing={isEditing}
                editContent={editContent}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
                onEditClick={() => handleEditClick(comment)}
                onDeleteClick={() => handleDelete(comment.id)}
                onSaveEdit={() => handleSaveEdit(comment.id)}
                onCancelEdit={handleCancelEdit}
                onEditContentChange={setEditContent}
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
