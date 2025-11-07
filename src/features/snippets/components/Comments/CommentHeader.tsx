import { Link } from 'react-router-dom';
import { getFirstLetter } from '../../../../shared/utils/userUtils';
import SnippetActions from '../SnippetCard/SnippetActions';

interface CommentHeaderProps {
  username: string;
  userId: string;
  isOwner: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function CommentHeader({
  username,
  userId,
  isOwner,
  isEditing,
  isUpdating,
  isDeleting,
  onEditClick,
  onDeleteClick,
}: CommentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Link
        to={`/users/${userId}`}
        className="w-fit flex items-center gap-2 font-bold text-gray-500"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
          {getFirstLetter(username)}
        </div>
        <span>{username}</span>
      </Link>
      {isOwner && !isEditing && (
        <SnippetActions
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          editTitle="Edit comment"
          deleteTitle="Delete comment"
          className="gap-3"
        />
      )}
    </div>
  );
}
