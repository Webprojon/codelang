import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CodeEditor from '../../../../shared/components/ui/CodeEditor';
import Button from '../../../../shared/components/ui/Button';
import { SNIPPET_STYLES } from '../../../snippets/utils/styles';
import type { QuestionFormData } from '../../types';

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  initialQuestion?: QuestionFormData;
  submitButtonText?: string;
}

const defaultFormData: QuestionFormData = {
  title: '',
  description: '',
  attachedCode: '',
};

export default function QuestionForm({
  onSubmit,
  isSubmitting,
  submitError,
  initialQuestion,
  submitButtonText = 'SUBMIT',
}: QuestionFormProps) {
  const [attachedCode, setAttachedCode] = useState(initialQuestion?.attachedCode || '');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<QuestionFormData>({
    mode: 'onChange',
    defaultValues: initialQuestion || defaultFormData,
  });

  useEffect(() => {
    if (initialQuestion) {
      const code = initialQuestion.attachedCode || '';
      setAttachedCode(code);
      reset(initialQuestion, { keepDefaultValues: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const handleCodeChange = (newCode: string) => {
    setAttachedCode(newCode);
    setValue('attachedCode', newCode, { shouldValidate: true, shouldDirty: true });
    if (newCode.trim()) {
      clearErrors('attachedCode');
    }
  };

  const handleFormSubmit = async (data: QuestionFormData) => {
    await onSubmit({ ...data, attachedCode });
  };

  const inputClasses =
    'w-full px-4 py-3 bg-white border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none';

  return (
    <div>
      {submitError && <div className={SNIPPET_STYLES.errorMessage}>{submitError}</div>}

      <div className="rounded-lg mt-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div>
            <input
              id="title"
              type="text"
              placeholder="Question title"
              className={`${inputClasses} ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
              })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <textarea
              id="description"
              placeholder="Question description"
              rows={3}
              className={`${inputClasses} ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <span className="font-bold text-gray-500">Attached code:</span>
            <div className={SNIPPET_STYLES.codeEditorWrapper}>
              <CodeEditor value={attachedCode} onChange={handleCodeChange} language="JavaScript" />
            </div>
            {errors.attachedCode && (
              <p className="mt-1 text-sm text-red-600">{errors.attachedCode.message}</p>
            )}
            <input
              type="hidden"
              {...register('attachedCode', {
                validate: () => true,
              })}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={SNIPPET_STYLES.submitButton}
            color="primary"
            size="md"
          >
            {isSubmitting ? 'Processing...' : submitButtonText}
          </Button>
        </form>
      </div>
    </div>
  );
}
