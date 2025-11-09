import { useRef, useEffect, useCallback } from 'react';
import type { ApiComment } from '@features/snippets/types';
import { useUpdateComment, useDeleteComment } from '@features/snippets/hooks/comments';
import { useConfirmModal } from '@shared/hooks/useConfirmModal';
import { useCommentStore } from '@features/snippets/store/commentStore';
import toast from 'react-hot-toast';

interface UseCommentHandlersProps {
  comments: ApiComment[];
  snippetId: number;
}

interface UseCommentHandlersReturn {
  confirmModal: ReturnType<typeof useConfirmModal>;
}

export const useCommentHandlers = ({
  comments,
  snippetId,
}: UseCommentHandlersProps): UseCommentHandlersReturn => {
  const { updateComment, isUpdating } = useUpdateComment(snippetId);
  const { deleteComment, isDeleting } = useDeleteComment(snippetId);
  const confirmModal = useConfirmModal();
  const {
    editContent,
    setEditingCommentId,
    setEditContent,
    setIsUpdating,
    setIsDeleting,
    setOnEditClick,
    setOnDeleteClick,
    setOnSaveEdit,
    setOnCancelEdit,
    setOnEditContentChange,
  } = useCommentStore();

  const handleEditClickRef = useRef<(commentId: string) => void | undefined>(undefined);
  const handleDeleteRef = useRef<(commentId: string) => void | undefined>(undefined);
  const handleSaveEditRef = useRef<(commentId: string) => void | undefined>(undefined);
  const handleCancelEditRef = useRef<() => void | undefined>(undefined);
  const handleEditContentChangeRef = useRef<(content: string) => void | undefined>(undefined);

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

  // Update refs when callbacks change
  handleEditClickRef.current = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) handleEditClick(comment);
  };
  handleDeleteRef.current = (commentId: string) => {
    handleDelete(commentId).catch(console.error);
  };
  handleSaveEditRef.current = (commentId: string) => {
    handleSaveEdit(commentId).catch(console.error);
  };
  handleCancelEditRef.current = handleCancelEdit;
  handleEditContentChangeRef.current = setEditContent;

  useEffect(() => {
    setIsUpdating(isUpdating);
  }, [isUpdating, setIsUpdating]);

  useEffect(() => {
    setIsDeleting(isDeleting);
  }, [isDeleting, setIsDeleting]);

  useEffect(() => {
    setOnEditClick((commentId: string) => {
      handleEditClickRef.current?.(commentId);
    });
    setOnDeleteClick((commentId: string) => {
      handleDeleteRef.current?.(commentId);
    });
    setOnSaveEdit((commentId: string) => {
      handleSaveEditRef.current?.(commentId);
    });
    setOnCancelEdit(() => {
      handleCancelEditRef.current?.();
    });
    setOnEditContentChange((content: string) => {
      handleEditContentChangeRef.current?.(content);
    });

    return () => {
      setOnEditClick(null);
      setOnDeleteClick(null);
      setOnSaveEdit(null);
      setOnCancelEdit(null);
      setOnEditContentChange(null);
      setEditingCommentId(null);
      setEditContent('');
    };
  }, [
    setOnEditClick,
    setOnDeleteClick,
    setOnSaveEdit,
    setOnCancelEdit,
    setOnEditContentChange,
    setEditingCommentId,
    setEditContent,
  ]);

  return {
    confirmModal,
  };
};
