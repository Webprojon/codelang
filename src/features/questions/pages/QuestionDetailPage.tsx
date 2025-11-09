import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestionById } from '../api/questionsApi';
import { LoadingSpinner } from '@shared/components/feedback';
import Button from '@shared/components/ui/Button';
import CodeEditor from '@shared/components/ui/CodeEditor';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import { useAuthStore } from '@features/auth/store/authStore';
import { ConfirmModal } from '@shared/components/feedback';
import AnswerForm from '../components/AnswerComponents/AnswerForm';
import QuestionHeader from '../components/QuestionComponents/QuestionHeader';
import AnswersList from '../components/AnswerComponents/AnswersList';
import LoginPrompt from '../components/LoginPrompt';
import { useAnswerHandlers } from '../hooks/answers';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.user);
  const formRef = useRef<HTMLDivElement>(null);

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

  const {
    handleAnswerSubmit,
    editingAnswerId,
    setEditingAnswerId,
    isSubmitting,
    isUpdating,
    isDeleting,
    submitError,
    updateError,
    confirmModal,
    getInitialAnswer,
  } = useAnswerHandlers({ question, formRef });

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

        <AnswersList answers={question.answers} isDeleting={isDeleting} isUpdating={isUpdating} />
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
