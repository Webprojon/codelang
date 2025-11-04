import { useState } from 'react';
import type { ChangeUsernameFormData } from '../types';

interface ChangeUsernameFormProps {
  onSubmit: (data: ChangeUsernameFormData) => void;
}

export default function ChangeUsernameForm({ onSubmit }: ChangeUsernameFormProps) {
  const [newUsername, setNewUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ newUsername });
    setNewUsername('');
  };

  return (
    <div className="flex-1">
      <h3 className="text-black font-bold mb-3 mt-6">Change your username:</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New username"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          className="w-full rounded border border-gray-400 px-3 py-[10px] mb-4 text-black placeholder:text-gray-400 outline-none"
        />
        <button
          type="submit"
          className="w-full rounded cursor-pointer bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-slate-200 uppercase py-[8px] shadow-md"
        >
          SAVE
        </button>
      </form>
    </div>
  );
}
