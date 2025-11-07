import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import type { User } from '../../auth/types';
import { getFirstLetter } from '../../../shared/utils/userUtils';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const firstLetter = getFirstLetter(user.username);

  return (
    <Link
      to={`/users/${user.id}`}
      className="block border border-gray-200 rounded-lg shadow-auth hover:shadow-md transition-shadow p-4 bg-white"
    >
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-semibold text-lg shrink-0">
          {firstLetter}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-600 truncate">{user.username}</h3>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
          <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
        </div>
        <FaUser className="w-5 h-5 text-gray-400 shrink-0" />
      </div>
    </Link>
  );
}
