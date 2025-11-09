import { useRef, useEffect, useCallback } from 'react';
import {
  useCreateAnswer,
  useUpdateAnswer,
  useDeleteAnswer,
} from '@features/questions/hooks/answers';
import { useConfirmModal } from '@shared/hooks/useConfirmModal';
import { useAnswerStore } from '@features/questions/store/answerStore';
import type { AnswerFormData, Question } from '@features/questions/types';
import toast from 'react-hot-toast';

interface UseAnswerHandlersProps {
  question: Question | null | undefined;
  formRef: React.RefObject<HTMLDivElement | null>;
}

interface UseAnswerHandlersReturn {
  handleAnswerSubmit: (data: AnswerFormData) => Promise<void>;
  handleEditClick: (answerId: number) => void;
  handleDeleteAnswer: (answerId: number) => void;
  editingAnswerId: number | null;
  setEditingAnswerId: (answerId: number | null) => void;
  isSubmitting: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  submitError: string | null;
  updateError: string | null;
  confirmModal: ReturnType<typeof useConfirmModal>;
  getInitialAnswer: () => AnswerFormData | undefined;
}

export const useAnswerHandlers = ({
  question,
  formRef,
}: UseAnswerHandlersProps): UseAnswerHandlersReturn => {
  const { isSubmitting, error: submitError, createAnswer } = useCreateAnswer();
  const { updateAnswer, isUpdating, error: updateError } = useUpdateAnswer();
  const { deleteAnswer, isDeleting } = useDeleteAnswer();
  const confirmModal = useConfirmModal();
  const { editingAnswerId, setEditingAnswerId, setOnEdit, setOnDelete } = useAnswerStore();

  const handleEditClickRef = useRef<(answerId: number) => void | undefined>(undefined);
  const handleDeleteAnswerRef = useRef<(answerId: number) => void | undefined>(undefined);

  const handleAnswerSubmit = useCallback(
    async (data: AnswerFormData) => {
      if (!question) return;

      try {
        if (editingAnswerId) {
          await updateAnswer(editingAnswerId, question.id, { content: data.content.trim() });
          toast.success('Answer updated successfully!');
          setEditingAnswerId(null);
        } else {
          await createAnswer({ content: data.content.trim(), questionId: question.id });
          toast.success('Answer posted successfully!');
        }
      } catch (error) {
        console.error('Failed to save answer:', error);
        toast.error(editingAnswerId ? 'Failed to update answer' : 'Failed to post answer');
      }
    },
    [question, editingAnswerId, updateAnswer, createAnswer, setEditingAnswerId]
  );

  const handleEditClick = useCallback(
    (answerId: number) => {
      setEditingAnswerId(answerId);
      setTimeout(
        () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        100
      );
    },
    [setEditingAnswerId, formRef]
  );

  const handleDeleteAnswer = useCallback(
    (answerId: number) => {
      if (!question) return;
      confirmModal.showConfirm('Are you sure you want to delete this answer?', async () => {
        try {
          confirmModal.setLoading(true);
          await deleteAnswer(answerId, question.id);
          toast.success('Answer deleted successfully');
        } catch (error) {
          console.error('Failed to delete answer:', error);
          toast.error('Failed to delete answer');
        } finally {
          confirmModal.setLoading(false);
        }
      });
    },
    [question, confirmModal, deleteAnswer]
  );

  // Update refs when callbacks change
  handleEditClickRef.current = handleEditClick;
  handleDeleteAnswerRef.current = handleDeleteAnswer;

  useEffect(() => {
    setOnEdit((answerId: number) => {
      handleEditClickRef.current?.(answerId);
    });
    setOnDelete((answerId: number) => {
      handleDeleteAnswerRef.current?.(answerId);
    });

    return () => {
      setOnEdit(null);
      setOnDelete(null);
      setEditingAnswerId(null);
    };
  }, [setOnEdit, setOnDelete, setEditingAnswerId]);

  const getInitialAnswer = useCallback((): AnswerFormData | undefined => {
    if (!editingAnswerId || !question) return undefined;
    const answer = question.answers.find(a => a.id === editingAnswerId);
    return answer ? { content: answer.content } : undefined;
  }, [editingAnswerId, question]);

  return {
    handleAnswerSubmit,
    handleEditClick,
    handleDeleteAnswer,
    editingAnswerId,
    setEditingAnswerId,
    isSubmitting,
    isUpdating,
    isDeleting,
    submitError: submitError || null,
    updateError: updateError || null,
    confirmModal,
    getInitialAnswer,
  };
};
