import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '@shared/components/ui/Button';
import { LoadingSpinner } from '@shared/components/feedback';
import { useUpdateSnippet } from '@features/snippets/hooks/snippets';
import { getSnippetById } from '@features/snippets/api/snippetApi';
import SnippetForm from '@features/snippets/components/SnippetForm';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import type { PostSnippetFormData } from '@features/snippets/types';
import toast from 'react-hot-toast';
import WelcomeHeader from '@shared/components/ui/WelcomeHeader';

export default function EditSnippetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isUpdating,
    error: updateError,
    updateSnippet: updateSnippetHandler,
  } = useUpdateSnippet();

  const {
    data: snippet,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['snippet', id ? parseInt(id, 10) : null],
    queryFn: () => getSnippetById(parseInt(id!, 10)),
    enabled: !!id,
  });

  const handleSubmit = async (data: PostSnippetFormData) => {
    if (!id) {
      return;
    }

    try {
      await updateSnippetHandler(parseInt(id, 10), {
        code: data.code.trim(),
        language: data.language,
      });
      toast.success('Snippet updated successfully');
      navigate('/my-snippets');
    } catch (error) {
      console.error('Failed to update snippet:', error);
      toast.error('Failed to update snippet');
    }
  };

  if (isLoading) {
    return (
      <div className={SNIPPET_STYLES.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (queryError || !snippet) {
    return (
      <div className={SNIPPET_STYLES.errorContainer}>
        <p className="text-red-600">
          {queryError ? 'Failed to load snippet' : 'Snippet not found'}
        </p>
        <Button onClick={() => navigate('/')} color="primary" size="md">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <WelcomeHeader title="Update your snippet!" />
      <SnippetForm
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitError={updateError}
        initialSnippet={snippet}
        submitButtonText="UPDATE SNIPPET"
      />
    </>
  );
}
