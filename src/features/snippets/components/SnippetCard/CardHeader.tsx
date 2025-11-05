import { FaUser } from 'react-icons/fa';
import { RiCodeBoxLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { formatLanguage } from './utils';

interface CardHeaderProps {
  username: string;
  language: string;
  snippetId: number;
}

export default function CardHeader({ username, language, snippetId }: CardHeaderProps) {
  return (
    <div className="px-3 py-2 border-b border-gray-300 flex items-center justify-between">
      <Link to={`/users/${snippetId}`} className="flex items-center text-sm gap-2">
        <FaUser />
        <span>{username}</span>
      </Link>
      <div className="flex items-center text-sm gap-2">
        <RiCodeBoxLine />
        <span>{formatLanguage(language)}</span>
      </div>
    </div>
  );
}
