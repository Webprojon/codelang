import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { getCurrentUser } from '../../features/auth/services/authService';
import type { User } from '../../features/auth/types';

interface UserAvatarProps {
  isCollapsed?: boolean;
  onLinkClick?: () => void;
}

export default function UserAvatar({ isCollapsed = false, onLinkClick }: UserAvatarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        const response = currentUser as unknown as Record<string, unknown>;
        const userData = (response?.user as User) || (response?.data as User) || currentUser;
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="animate-pulse bg-brand-500 rounded-full w-9 h-9"></div>
        {!isCollapsed && <div className="animate-pulse bg-brand-500 h-4 w-24 rounded"></div>}
      </div>
    );
  }

  if (!user || !user.username) {
    return null;
  }

  const firstLetter = user.username.charAt(0).toUpperCase();
  const displayName = user.username.charAt(0).toUpperCase() + user.username.slice(1);

  return (
    <div className="flex items-center gap-3">
      <Link to={`/user/${user.id}`} className="cursor-pointer" onClick={onLinkClick}>
        <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-semibold text-base">
          {firstLetter}
        </div>
      </Link>
      {!isCollapsed && (
        <Link
          to={`/user/${user.id}`}
          className="cursor-pointer hover:text-white transition-colors"
          onClick={onLinkClick}
        >
          {displayName}
        </Link>
      )}
    </div>
  );
}
