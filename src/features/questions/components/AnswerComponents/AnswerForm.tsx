import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@shared/components/ui/Button';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import { ANSWER_CONTENT_VALIDATION } from '@shared/utils/validations';
import type { AnswerFormData } from '@features/questions/types';

interface AnswerFormProps {
  onSubmit: (data: AnswerFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  initialAnswer?: AnswerFormData;
  submitButtonText?: string;
  onCancel?: () => void;
}

export default function AnswerForm({
  onSubmit,
  isSubmitting,
  submitError,
  initialAnswer,
  submitButtonText = 'Post Answer',
  onCancel,
}: AnswerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormData>({
    mode: 'onChange',
    defaultValues: initialAnswer || {
      content: '',
    },
  });

  useEffect(() => {
    if (initialAnswer) {
      reset(initialAnswer, { keepDefaultValues: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAnswer]);

  const handleFormSubmit = async (data: AnswerFormData) => {
    await onSubmit(data);
    if (!initialAnswer) {
      reset();
    } else {
      reset({ content: '' });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-700">
        {initialAnswer ? 'Edit Your Answer' : 'Your Answer'}
      </h3>
      {submitError && <div className={SNIPPET_STYLES.errorMessage}>{submitError}</div>}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <textarea
            id="content"
            placeholder="Write your answer here..."
            rows={6}
            className={`form-input-standard ${errors.content ? 'input-border-error' : 'input-border-default'}`}
            {...register('content', ANSWER_CONTENT_VALIDATION)}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={SNIPPET_STYLES.submitButton}
            color="primary"
            size="md"
          >
            {isSubmitting ? 'Processing...' : submitButtonText}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={() => {
                reset({ content: '' });
                onCancel();
              }}
              disabled={isSubmitting}
              color="secondary"
              size="md"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
