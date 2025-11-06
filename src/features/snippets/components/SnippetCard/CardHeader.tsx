import { FaUser, FaRegEdit } from 'react-icons/fa';
import { RiCodeBoxLine, RiDeleteBinLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { formatLanguage } from './utils';
import { useDeleteSnippet } from '../../hooks/useDeleteSnippet';
import { SNIPPET_STYLES } from '../../utils/styles';
import toast from 'react-hot-toast';
import { useConfirmModal } from '../../../../shared/hooks/useConfirmModal';
import ConfirmModal from '../../../../shared/components/ConfirmModal';

interface CardHeaderProps {
  username: string;
  language: string;
  snippetId: number;
  showActions?: boolean;
}

export default function CardHeader({
  username,
  language,
  snippetId,
  showActions = false,
}: CardHeaderProps) {
  const navigate = useNavigate();
  const { deleteSnippet, isDeleting } = useDeleteSnippet();
  const confirmModal = useConfirmModal();

  const handleDelete = async () => {
    confirmModal.showConfirm('Are you sure you want to delete this snippet?', async () => {
      try {
        await deleteSnippet(snippetId);
        toast.success('Snippet deleted successfully');
      } catch (error) {
        console.error('Failed to delete snippet:', error);
        toast.error('Failed to delete snippet');
      }
    });
  };

  const handleEdit = () => {
    navigate(`/snippets/${snippetId}/edit`);
  };

  return (
    <>
      <div className={SNIPPET_STYLES.cardHeader}>
        <Link to={`/users/${snippetId}`} className="flex items-center text-sm gap-2">
          <FaUser />
          <span>{username}</span>
        </Link>
        <div className="flex items-center text-sm gap-2">
          {showActions && (
            <div className="flex items-center gap-3 mr-2">
              <button
                onClick={handleEdit}
                className={SNIPPET_STYLES.editButton}
                title="Edit snippet"
                disabled={isDeleting}
              >
                <FaRegEdit className="size-4" />
              </button>
              <button
                onClick={handleDelete}
                className={SNIPPET_STYLES.deleteButton}
                title="Delete snippet"
                disabled={isDeleting}
              >
                <RiDeleteBinLine className="size-4" />
              </button>
            </div>
          )}
          <RiCodeBoxLine className="size-4" />
          <span>{formatLanguage(language)}</span>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        onConfirm={confirmModal.handleConfirm}
        onCancel={confirmModal.handleCancel}
        isLoading={confirmModal.isLoading}
      />
    </>
  );
}
