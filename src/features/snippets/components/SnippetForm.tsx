import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Select from '@shared/components/ui/Select';
import CodeEditor from '@shared/components/ui/CodeEditor';
import Button from '@shared/components/ui/Button';
import { LoadingSpinner } from '@shared/components/feedback';
import { useLanguages } from '@features/snippets/hooks/useLanguages';
import { DEFAULT_LANGUAGE } from '@features/snippets/constants';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import type { PostSnippetFormData } from '@features/snippets/types';
import type { ApiSnippet } from '@features/snippets/types';

interface SnippetFormProps {
  onSubmit: (data: PostSnippetFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  initialSnippet?: ApiSnippet | null;
  submitButtonText?: string;
}

export default function SnippetForm({
  onSubmit,
  isSubmitting,
  submitError,
  initialSnippet,
  submitButtonText = 'SUBMIT',
}: SnippetFormProps) {
  const [code, setCode] = useState('');
  const { languages, isLoading: isLoadingLanguages } = useLanguages();

  const languageOptions = useMemo(() => {
    return languages.map(lang => ({
      value: lang,
      label: lang,
    }));
  }, [languages]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PostSnippetFormData>({
    mode: 'onChange',
    defaultValues: {
      language: DEFAULT_LANGUAGE,
      code: '',
    },
  });

  const selectedLanguage = watch('language');

  useEffect(() => {
    if (initialSnippet) {
      const snippetCode = initialSnippet.code || '';
      const snippetLanguage = initialSnippet.language || DEFAULT_LANGUAGE; // Keep original format
      setCode(snippetCode);
      setValue('code', snippetCode, { shouldValidate: true, shouldDirty: true });
      setValue('language', snippetLanguage);
    }
  }, [initialSnippet, setValue]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setValue('code', newCode, { shouldValidate: true, shouldDirty: true });
    if (newCode.trim()) {
      clearErrors('code');
    }
  };

  const handleFormSubmit = async (data: PostSnippetFormData) => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError('code', {
        type: 'manual',
        message: 'Code is required',
      });
      return;
    }

    const finalData = {
      ...data,
      code: trimmedCode,
    };

    await onSubmit(finalData);
  };

  if (isLoadingLanguages) {
    return (
      <div className={SNIPPET_STYLES.loadingContainer}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {submitError && <div className={SNIPPET_STYLES.errorMessage}>{submitError}</div>}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-8">
        <div>
          <label htmlFor="language" className="text-sm font-bold block mb-2">
            Language of your snippet:
          </label>
          <Select
            id="language"
            options={languageOptions}
            error={errors.language?.message}
            selectClassName={SNIPPET_STYLES.select}
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
          <div className={SNIPPET_STYLES.codeEditorWrapper}>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={selectedLanguage || DEFAULT_LANGUAGE}
            />
          </div>
          {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
          <input
            type="hidden"
            {...register('code', {
              required: 'Code is required',
              validate: () => {
                const trimmed = code.trim();
                return trimmed.length > 0 || 'Code cannot be empty';
              },
            })}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !code.trim()}
          className={SNIPPET_STYLES.submitButton}
          color="primary"
          size="md"
        >
          {isSubmitting ? 'Processing...' : submitButtonText}
        </Button>
      </form>
    </>
  );
}
