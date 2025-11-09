import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '@shared/components/ui/Button';
import { LoadingSpinner } from '@shared/components/feedback';
import { useUpdateQuestion } from '@features/questions/hooks/questions';
import { getQuestionById } from '@features/questions/api/questionsApi';
import QuestionForm from '@features/questions/components/QuestionComponents/QuestionForm';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import type { QuestionFormData } from '@features/questions/types';
import toast from 'react-hot-toast';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';

export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isUpdating,
    error: updateError,
    updateQuestion: updateQuestionHandler,
  } = useUpdateQuestion();

  const {
    data: question,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['question', id ? parseInt(id, 10) : null],
    queryFn: () => getQuestionById(parseInt(id!, 10)),
    enabled: !!id,
  });

  const initialQuestionData: QuestionFormData | undefined = question
    ? {
        title: question.title || '',
        description: question.description || '',
        attachedCode: question.attachedCode || '',
      }
    : undefined;

  const handleSubmit = async (data: QuestionFormData) => {
    if (!id) {
      return;
    }

    try {
      await updateQuestionHandler(parseInt(id, 10), {
        title: data.title.trim(),
        description: data.description.trim(),
        attachedCode: data.attachedCode || '',
      });
      toast.success('Question updated successfully');
      navigate('/questions');
    } catch (error) {
      console.error('Failed to update question:', error);
      toast.error('Failed to update question');
    }
  };

  if (isLoading) {
    return (
      <div className={SNIPPET_STYLES.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const error = queryError ? 'Failed to load question' : null;

  if (error || !question) {
    return (
      <div className={SNIPPET_STYLES.errorContainer}>
        <p className="text-red-600">{error || 'Question not found'}</p>
        <Button onClick={() => navigate('/questions')} color="primary" size="md">
          Go to Questions
        </Button>
      </div>
    );
  }

  return (
    <>
      <WelcomeHeader title="Update your question!" />
      <QuestionForm
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitError={updateError}
        initialQuestion={initialQuestionData}
        submitButtonText="UPDATE QUESTION"
      />
    </>
  );
}
