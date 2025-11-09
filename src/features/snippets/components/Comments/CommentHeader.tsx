import { Link } from 'react-router-dom';
import { getFirstLetter } from '@shared/utils/userUtils';
import EditDeleteActions from '@shared/components/ui/EditDeleteActions';

interface CommentHeaderProps {
  username: string;
  userId: string;
  commentId: string;
  isOwner: boolean;
  isEditing: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function CommentHeader({
  username,
  userId,
  isOwner,
  isEditing,
  onEditClick,
  onDeleteClick,
  isUpdating,
  isDeleting,
}: CommentHeaderProps) {
  return (
    <div className="flex justify-between">
      <Link to={`/users/${userId}`} className="w-fit flex gap-2 font-bold text-gray-500">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
          {getFirstLetter(username)}
        </div>
        <span>{username}</span>
      </Link>
      {isOwner && !isEditing && (
        <EditDeleteActions
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          editTitle="Edit comment"
          deleteTitle="Delete comment"
          className="gap-4"
        />
      )}
    </div>
  );
}
