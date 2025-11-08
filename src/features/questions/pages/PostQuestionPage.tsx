import { useNavigate } from 'react-router-dom';
import { useCreateQuestion } from '../hooks/questions';
import QuestionForm from '../components/QuestionComponents/QuestionForm';
import type { QuestionFormData } from '../types';
import toast from 'react-hot-toast';
import WelcomeHeader from '../../../shared/components/ui/WelcomeHeader';

export default function PostQuestionPage() {
  const navigate = useNavigate();
  const { isSubmitting, error: submitError, createQuestion } = useCreateQuestion();

  const handleSubmit = async (data: QuestionFormData) => {
    try {
      await createQuestion({
        title: data.title.trim(),
        description: data.description.trim(),
        attachedCode: data.attachedCode || '',
      });
      toast.success('Question created successfully');
      navigate('/questions');
    } catch (error) {
      console.error('Failed to create question:', error);
      toast.error('Failed to create question');
    }
  };

  return (
    <>
      <WelcomeHeader title="Ask a question" />
      <QuestionForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitButtonText="ASK QUESTION"
      />
    </>
  );
}
