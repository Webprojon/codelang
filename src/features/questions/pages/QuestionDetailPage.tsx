import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestionById } from '../api/questionsApi';
import { LoadingSpinner } from '../../../shared/components/feedback';
import Button from '../../../shared/components/ui/Button';
import CodeEditor from '../../../shared/components/ui/CodeEditor';
import { SNIPPET_STYLES } from '../../snippets/utils/styles';
import { useAuthStore } from '../../auth/store/authStore';
import { useCreateAnswer, useUpdateAnswer, useDeleteAnswer } from '../hooks/answers';
import { useConfirmModal } from '../../../shared/hooks/useConfirmModal';
import { ConfirmModal } from '../../../shared/components/feedback';
import AnswerForm from '../components/AnswerComponents/AnswerForm';
import QuestionHeader from '../components/QuestionComponents/QuestionHeader';
import AnswersList from '../components/AnswerComponents/AnswersList';
import LoginPrompt from '../components/LoginPrompt';
import type { AnswerFormData } from '../types';
import toast from 'react-hot-toast';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.user);
  const { isSubmitting, error: submitError, createAnswer } = useCreateAnswer();
  const { updateAnswer, isUpdating, error: updateError } = useUpdateAnswer();
  const { deleteAnswer, isDeleting } = useDeleteAnswer();
  const confirmModal = useConfirmModal();
  const formRef = useRef<HTMLDivElement>(null);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);

  const questionId = id ? parseInt(id, 10) : undefined;
  const {
    data: question,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['question', questionId],
    queryFn: () => getQuestionById(questionId!),
    enabled: !!questionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const handleAnswerSubmit = async (data: AnswerFormData) => {
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
  };

  const handleEditClick = (answerId: number) => {
    setEditingAnswerId(answerId);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const getInitialAnswer = (): AnswerFormData | undefined => {
    if (!editingAnswerId) return undefined;
    const answer = question?.answers.find(a => a.id === editingAnswerId);
    return answer ? { content: answer.content } : undefined;
  };

  if (isLoading) {
    return (
      <div className={SNIPPET_STYLES.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (queryError || !question) {
    return (
      <div className={SNIPPET_STYLES.errorContainer}>
        <p className="text-red-600">
          {queryError ? 'Failed to load question' : 'Question not found'}
        </p>
        <Button onClick={() => navigate('/questions')} color="primary" size="md">
          Go to Questions
        </Button>
      </div>
    );
  }

  const handleDeleteAnswer = (answerId: number) => {
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
  };

  const hasCode = Boolean(question.attachedCode?.trim());

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <QuestionHeader question={question} />

        <div className="rounded-lg">
          <h2 className="font-semibold text-gray-600 mb-1">Description</h2>
          <p className="italic leading-relaxed text-sm text-gray-500">{question.description}</p>
        </div>

        {hasCode && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-600">Attached Code</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <CodeEditor
                value={question.attachedCode || ''}
                onChange={() => {}}
                language="javascript"
                readOnly={true}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-700">
            Answers ({question.answers.length})
          </h2>
        </div>

        <AnswersList
          answers={question.answers}
          currentUser={currentUser}
          editingAnswerId={editingAnswerId}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          onEdit={handleEditClick}
          onDelete={handleDeleteAnswer}
        />
      </div>

      {currentUser && (
        <div ref={formRef} className="mt-8 pt-8 border-t border-gray-200">
          <AnswerForm
            onSubmit={handleAnswerSubmit}
            isSubmitting={isSubmitting || isUpdating}
            submitError={submitError || updateError}
            initialAnswer={getInitialAnswer()}
            submitButtonText={editingAnswerId ? 'Update Answer' : 'Post Answer'}
            onCancel={editingAnswerId ? () => setEditingAnswerId(null) : undefined}
          />
        </div>
      )}

      {!currentUser && <LoginPrompt />}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        onConfirm={confirmModal.handleConfirm}
        onCancel={confirmModal.handleCancel}
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
}
