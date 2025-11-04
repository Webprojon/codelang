import { useState } from 'react';
import type { ChangePasswordFormData } from '../types';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => void;
}

export default function ChangePasswordForm({ onSubmit }: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ oldPassword, newPassword, confirmPassword });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const inputClasses =
    'w-full rounded border border-gray-400 px-3 py-[10px] mb-3 text-black placeholder:text-gray-400 outline-none';

  return (
    <div className="flex-1">
      <h3 className="text-black font-bold mb-3 mt-6">Change your password:</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className={inputClasses}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className={inputClasses}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className={inputClasses}
        />
        <button
          type="submit"
          className="w-full rounded cursor-pointer bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-slate-200 uppercase py-[8px] shadow-md"
        >
          CHANGE PASSWORD
        </button>
      </form>
    </div>
  );
}
