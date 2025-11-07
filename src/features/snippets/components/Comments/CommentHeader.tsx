import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { getFirstLetter } from '../../../../shared/utils/userUtils';
import { SNIPPET_STYLES } from '../../utils/styles';
import { Button } from '../../../../shared/components/ui';

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
        <div className="flex items-center gap-3">
          <Button
            onClick={onEditClick}
            className={SNIPPET_STYLES.editButton}
            title="Edit comment"
            disabled={isDeleting || isUpdating}
            icon={<FaRegEdit className="size-4" />}
          />
          <Button
            onClick={onDeleteClick}
            className={SNIPPET_STYLES.deleteButton}
            title="Delete comment"
            disabled={isDeleting || isUpdating}
            icon={<RiDeleteBinLine className="size-4" />}
          />
        </div>
      )}
    </div>
  );
}
