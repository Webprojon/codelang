import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import Button from '../../../../shared/components/ui/Button';
import { SNIPPET_STYLES } from '../../utils/styles';

interface SnippetActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
  editTitle?: string;
  deleteTitle?: string;
  className?: string;
}

export default function SnippetActions({
  onEdit,
  onDelete,
  isDeleting = false,
  isUpdating = false,
  editTitle = 'Edit',
  deleteTitle = 'Delete',
  className = '',
}: SnippetActionsProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Button
        onClick={onEdit}
        className={SNIPPET_STYLES.editButton}
        color="ghost"
        size="sm"
        title={editTitle}
        disabled={isDeleting || isUpdating}
        icon={<FaRegEdit className="size-4" />}
      />
      <Button
        onClick={onDelete}
        className={SNIPPET_STYLES.deleteButton}
        color="ghost"
        size="sm"
        title={deleteTitle}
        disabled={isDeleting || isUpdating}
        icon={<RiDeleteBinLine className="size-4" />}
      />
    </div>
  );
}
