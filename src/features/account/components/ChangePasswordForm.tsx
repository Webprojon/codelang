import { useForm } from 'react-hook-form';
import type { ChangePasswordFormData } from '../types';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { PASSWORD_VALIDATION } from '../../../shared/utils/validations';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => void;
  isLoading?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    mode: 'onChange',
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const newPassword = watch('newPassword');

  const confirmPasswordValidation = {
    required: 'Please confirm your password',
    validate: (value?: string) => value === newPassword || 'Passwords do not match',
  };

  const onSubmitForm = (data: ChangePasswordFormData) => {
    if (isLoading) return;
    onSubmit(data);
    reset();
  };

  const isSubmittingForm = isSubmitting || isLoading;

  return (
    <div className="flex-1">
      <h3 className="text-black font-bold mb-3 mt-6">Change your password:</h3>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Input
          id="oldPassword"
          type="password"
          placeholder="Old password"
          error={errors.oldPassword?.message}
          inputClassName="text-black placeholder:text-gray-400 border border-gray-400 rounded px-3 py-[10px]"
          containerClassName="mb-3"
          disabled={isSubmittingForm}
          {...register('oldPassword', { required: 'Old password is required' })}
        />
        <Input
          id="newPassword"
          type="password"
          placeholder="New password"
          error={errors.newPassword?.message}
          inputClassName="text-black placeholder:text-gray-400 border border-gray-400 rounded px-3 py-[10px]"
          containerClassName="mb-3"
          disabled={isSubmittingForm}
          {...register('newPassword', PASSWORD_VALIDATION)}
        />
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          error={errors.confirmPassword?.message}
          inputClassName="text-black placeholder:text-gray-400 border border-gray-400 rounded px-3 py-[10px]"
          containerClassName="mb-3"
          disabled={isSubmittingForm}
          {...register('confirmPassword', confirmPasswordValidation)}
        />
        <Button
          type="submit"
          disabled={isSubmittingForm}
          className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white py-[8px] disabled:hover:bg-[#4CAF50] disabled:text-slate-300"
        >
          {isSubmittingForm ? 'Changing password...' : 'CHANGE PASSWORD'}
        </Button>
      </form>
    </div>
  );
}
