import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import Button from './Button';

interface EditDeleteActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
  editTitle?: string;
  deleteTitle?: string;
  className?: string;
}

export default function EditDeleteActions({
  onEdit,
  onDelete,
  isDeleting = false,
  isUpdating = false,
  editTitle = 'Edit',
  deleteTitle = 'Delete',
  className = '',
}: EditDeleteActionsProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Button
        onClick={onEdit}
        className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
        color="ghost"
        size="sm"
        title={editTitle}
        disabled={isDeleting || isUpdating}
        icon={<FaRegEdit className="size-4" />}
      />
      <Button
        onClick={onDelete}
        className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
        color="ghost"
        size="sm"
        title={deleteTitle}
        disabled={isDeleting || isUpdating}
        icon={<RiDeleteBinLine className="size-4" />}
      />
    </div>
  );
}
