import type { User } from '@features/auth/types';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <header className="mb-6 md:mb-8">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center px-2">
        Welcome, <span className="text-blue-500 font-bold">{user.username}</span>
      </h1>
    </header>
  );
}
