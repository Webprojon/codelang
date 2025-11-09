import { useCallback } from 'react';
import type { ApiComment } from '@features/snippets/types';
import { useUpdateComment, useDeleteComment } from '@features/snippets/hooks/comments';
import { useConfirmModal } from '@shared/hooks/useConfirmModal';
import { useCommentStore } from '@features/snippets/store/commentStore';
import toast from 'react-hot-toast';

interface UseCommentHandlersProps {
  snippetId: number;
}

interface UseCommentHandlersReturn {
  handleEditClick: (comment: ApiComment) => void;
  handleDelete: (commentId: string) => void;
  handleSaveEdit: (commentId: string) => void;
  handleCancelEdit: () => void;
  handleEditContentChange: (content: string) => void;
  confirmModal: ReturnType<typeof useConfirmModal>;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const useCommentHandlers = ({
  snippetId,
}: UseCommentHandlersProps): UseCommentHandlersReturn => {
  const { updateComment, isUpdating } = useUpdateComment(snippetId);
  const { deleteComment, isDeleting } = useDeleteComment(snippetId);
  const confirmModal = useConfirmModal();
  const { editContent, setEditingCommentId, setEditContent } = useCommentStore();

  const handleEditClick = useCallback(
    (comment: ApiComment) => {
      setEditingCommentId(comment.id);
      setEditContent(comment.content);
    },
    [setEditingCommentId, setEditContent]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditContent('');
  }, [setEditingCommentId, setEditContent]);

  const handleSaveEdit = useCallback(
    async (commentId: string) => {
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
    },
    [editContent, updateComment, setEditingCommentId, setEditContent]
  );

  const handleDelete = useCallback(
    async (commentId: string) => {
      confirmModal.showConfirm('Are you sure you want to delete this comment?', async () => {
        try {
          await deleteComment(parseInt(commentId, 10));
          toast.success('Comment deleted successfully');
        } catch (error) {
          console.error('Failed to delete comment:', error);
          toast.error('Failed to delete comment');
        }
      });
    },
    [confirmModal, deleteComment]
  );

  const handleEditContentChange = useCallback(
    (content: string) => {
      setEditContent(content);
    },
    [setEditContent]
  );

  return {
    handleEditClick,
    handleDelete,
    handleSaveEdit,
    handleCancelEdit,
    handleEditContentChange,
    confirmModal,
    isUpdating,
    isDeleting,
  };
};
