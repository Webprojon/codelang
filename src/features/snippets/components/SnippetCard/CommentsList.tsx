import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import type { ApiComment } from '../../types';
import { useUpdateComment } from '../../hooks/useUpdateComment';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import { isSameUser } from '../../utils/userUtils';
import { SNIPPET_STYLES } from '../../utils/styles';
import toast from 'react-hot-toast';
import { useConfirmModal } from '../../../../shared/hooks/useConfirmModal';
import ConfirmModal from '../../../../shared/components/ConfirmModal';

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

  const isCommentOwner = (comment: ApiComment) => {
    return isSameUser(comment.user.id, currentUserId);
  };

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB;
    });
  }, [comments]);

  if (sortedComments.length === 0) {
    return (
      <div className="px-4 py-3 border-t border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-400">No comments yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Comments ({sortedComments.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedComments.map(comment => {
            const isOwner = isCommentOwner(comment);
            const isEditing = editingCommentId === comment.id;

            return (
              <div key={comment.id} className="px-4 py-3">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/users/${comment.user.id}`}
                      className="w-fit flex items-center gap-2 font-bold text-gray-500"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                        {comment.user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{comment.user.username}</span>
                    </Link>
                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditClick(comment)}
                          className={SNIPPET_STYLES.editButton}
                          title="Edit comment"
                          disabled={isDeleting || isUpdating}
                        >
                          <FaRegEdit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className={SNIPPET_STYLES.deleteButton}
                          title="Delete comment"
                          disabled={isDeleting || isUpdating}
                        >
                          <RiDeleteBinLine className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="ml-10 mt-2">
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 resize-none"
                        rows={2}
                        disabled={isUpdating}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={isUpdating || !editContent.trim()}
                          className="cursor-pointer px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="cursor-pointer px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
                  )}
                </div>
              </div>
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
