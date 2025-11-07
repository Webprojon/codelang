import { useForm } from 'react-hook-form';
import type { ChangeUsernameFormData } from '../types';
import { Button, Input } from '../../../shared/components/ui';
import { USERNAME_VALIDATION } from '../../../shared/utils/validations';

interface ChangeUsernameFormProps {
  onSubmit: (data: ChangeUsernameFormData) => void;
  isLoading?: boolean;
}

export default function ChangeUsernameForm({
  onSubmit,
  isLoading = false,
}: ChangeUsernameFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeUsernameFormData>({
    mode: 'onChange',
    defaultValues: { newUsername: '' },
  });

  const onSubmitForm = (data: ChangeUsernameFormData) => {
    if (isLoading) return;
    onSubmit(data);
    reset();
  };

  const isSubmittingForm = isSubmitting || isLoading;

  return (
    <div className="flex-1">
      <h3 className="text-black font-bold mb-3 mt-6">Change your username:</h3>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Input
          id="newUsername"
          type="text"
          placeholder="New username"
          error={errors.newUsername?.message}
          inputClassName="text-black placeholder:text-gray-400 border border-gray-400 rounded px-3 py-[10px]"
          containerClassName="mb-4"
          disabled={isSubmittingForm}
          {...register('newUsername', USERNAME_VALIDATION)}
        />
        <Button
          type="submit"
          disabled={isSubmittingForm}
          className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white py-[8px] disabled:hover:bg-[#4CAF50] disabled:text-slate-300"
        >
          {isSubmittingForm ? 'Saving...' : 'SAVE'}
        </Button>
      </form>
    </div>
  );
}
