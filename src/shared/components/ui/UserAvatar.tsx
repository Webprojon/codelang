import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { getFirstLetter } from '../../utils/userUtils';

interface UserAvatarProps {
  isCollapsed?: boolean;
  onLinkClick?: () => void;
}

export default function UserAvatar({ isCollapsed = false, onLinkClick }: UserAvatarProps) {
  const user = useAuthStore(state => state.user);

  if (!user || !user.username) {
    return null;
  }

  const firstLetter = getFirstLetter(user.username);
  const displayName = getFirstLetter(user.username) + user.username.slice(1);

  return (
    <div className="flex items-center gap-3">
      <Link to="/my-account" className="cursor-pointer" onClick={onLinkClick}>
        <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-semibold text-base">
          {firstLetter}
        </div>
      </Link>
      {!isCollapsed && (
        <Link
          to="/my-account"
          className="cursor-pointer hover:text-white transition-colors"
          onClick={onLinkClick}
        >
          {displayName}
        </Link>
      )}
    </div>
  );
}
