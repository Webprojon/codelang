import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Select from '../../../shared/components/Select';
import CodeEditor from '../../../shared/components/CodeEditor';
import Button from '../../../shared/components/Button';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { useUpdateSnippet } from '../hooks/useUpdateSnippet';
import { getSnippetById } from '../services/snippetService';
import { useAuthStore } from '../../auth/store/authStore';
import { LANGUAGE_OPTIONS, DEFAULT_LANGUAGE } from '../constants';
import type { PostSnippetFormData } from '../types';
import toast from 'react-hot-toast';

const SELECT_CLASSES = 'text-black placeholder:text-gray-400 focus:border-brand-500';

export default function EditSnippetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isUpdating,
    error: updateError,
    updateSnippet: updateSnippetHandler,
  } = useUpdateSnippet();
  const currentUserId = useAuthStore(state => state.user?.id);
  const [code, setCode] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostSnippetFormData>({
    mode: 'onChange',
    defaultValues: {
      language: DEFAULT_LANGUAGE,
      code: '',
    },
  });

  const selectedLanguage = watch('language');

  const {
    data: snippet,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['snippet', id ? parseInt(id, 10) : null],
    queryFn: () => getSnippetById(parseInt(id!, 10)),
    enabled: !!id,
  });

  useEffect(() => {
    if (snippet) {
      // Check if current user is the owner
      const snippetUserId = parseInt(snippet.user.id, 10);
      if (currentUserId !== undefined && snippetUserId !== currentUserId) {
        toast.error('You can only edit your own snippets');
        navigate(`/snippets/${id}`);
        return;
      }

      setCode(snippet.code);
      setValue('language', snippet.language.toLowerCase());
    }
  }, [snippet, currentUserId, navigate, id, setValue]);

  const onSubmit = async (data: PostSnippetFormData) => {
    if (!code.trim() || !id) {
      return;
    }

    try {
      await updateSnippetHandler(parseInt(id, 10), {
        code: code.trim(),
        language: data.language,
      });
      toast.success('Snippet updated successfully');
      navigate(`/snippets/${id}`);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to update snippet:', error);
      toast.error('Failed to update snippet');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const error = queryError ? 'Failed to load snippet' : null;

  if (error || !snippet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600">{error || 'Snippet not found'}</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-10">Edit snippet</h1>

      {updateError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {updateError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="language" className="text-sm font-bold block mb-2">
            Language of your snippet:
          </label>
          <Select
            id="language"
            options={LANGUAGE_OPTIONS}
            error={errors.language?.message}
            selectClassName={SELECT_CLASSES}
            value={selectedLanguage}
            {...register('language', {
              required: 'Please select a language',
            })}
          />
        </div>

        <div>
          <label htmlFor="code" className="text-base font-bold">
            Code of your snippet:
          </label>
          <div className="mt-2 border border-gray-300">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage || DEFAULT_LANGUAGE}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => navigate(`/snippets/${id}`)}
            className="flex-1 py-2 bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUpdating || !code.trim()}
            className="flex-1 py-2 bg-brand-700 text-slate-300 hover:bg-brand-500 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update snippet'}
          </Button>
        </div>
      </form>
    </>
  );
}
