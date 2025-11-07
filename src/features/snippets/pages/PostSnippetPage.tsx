import { useNavigate } from 'react-router-dom';
import { usePostSnippet } from '../hooks/usePostSnippet';
import SnippetForm from '../components/SnippetForm';
import type { PostSnippetFormData } from '../types';
import toast from 'react-hot-toast';
import WelcomeHeader from '../../../shared/components/ui/WelcomeHeader';

export default function PostSnippetPage() {
  const navigate = useNavigate();
  const { isSubmitting, error: submitError, submitSnippet } = usePostSnippet();

  const handleSubmit = async (data: PostSnippetFormData) => {
    try {
      await submitSnippet({
        code: data.code,
        language: data.language,
      });
      toast.success('Snippet created successfully');
      navigate('/my-snippets');
    } catch (error) {
      console.error('Failed to create snippet:', error);
    }
  };

  return (
    <>
      <WelcomeHeader title="Create new snippet!" />
      <SnippetForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitButtonText="CREATE SNIPPET"
      />
    </>
  );
}
