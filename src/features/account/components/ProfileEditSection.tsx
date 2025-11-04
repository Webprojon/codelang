import ChangeUsernameForm from './ChangeUsernameForm';
import ChangePasswordForm from './ChangePasswordForm';
import type { ChangeUsernameFormData, ChangePasswordFormData } from '../types';

interface ProfileEditSectionProps {
  onUsernameChange: (data: ChangeUsernameFormData) => void;
  onPasswordChange: (data: ChangePasswordFormData) => void;
}

export default function ProfileEditSection({
  onUsernameChange,
  onPasswordChange,
}: ProfileEditSectionProps) {
  return (
    <article className="border border-gray-300 rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 md:mt-10 max-w-5xl mx-auto">
      <h2 className="text-black underline text-base sm:text-lg md:text-xl mb-4 sm:mb-6">
        Edit your profile:
      </h2>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <ChangeUsernameForm onSubmit={onUsernameChange} />
        <ChangePasswordForm onSubmit={onPasswordChange} />
      </div>
    </article>
  );
}
