import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from '../../../shared/components/Select';
import CodeEditor from '../../../shared/components/CodeEditor';
import Button from '../../../shared/components/Button';
import { usePostSnippet } from '../hooks/usePostSnippet';
import { LANGUAGE_OPTIONS, DEFAULT_LANGUAGE } from '../constants';
import type { PostSnippetFormData } from '../types';

const SELECT_CLASSES = 'text-black placeholder:text-gray-400 focus:border-brand-500';

export default function PostSnippetPage() {
  const [code, setCode] = useState('');
  const { isSubmitting, error: submitError, submitSnippet } = usePostSnippet();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostSnippetFormData>({
    mode: 'onChange',
    defaultValues: {
      language: DEFAULT_LANGUAGE,
      code: '',
    },
  });

  const selectedLanguage = watch('language');

  const onSubmit = async (data: PostSnippetFormData) => {
    if (!code.trim()) {
      return;
    }

    try {
      await submitSnippet({
        code: code.trim(),
        language: data.language,
      });
      // TODO: Navigate to success page or show success message
      console.log('Snippet created successfully');
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to create snippet:', error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-10">Create new snippet!</h1>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
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

        <Button
          type="submit"
          disabled={isSubmitting || !code.trim()}
          className="w-full py-2 bg-brand-700 text-slate-300 hover:bg-brand-500 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create snippet'}
        </Button>
      </form>
    </>
  );
}
