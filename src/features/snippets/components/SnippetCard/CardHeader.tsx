import { useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiCodeBoxLine } from 'react-icons/ri';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { formatLanguage } from '@features/snippets/components/SnippetCard/utils';
import { useDeleteSnippet } from '@features/snippets/hooks/snippets';
import { SNIPPET_STYLES } from '@features/snippets/utils/styles';
import toast from 'react-hot-toast';
import { useConfirmModal } from '@shared/hooks/useConfirmModal';
import { ConfirmModal } from '@shared/components/feedback';
import EditDeleteActions from '@shared/components/ui/EditDeleteActions';
import { useSnippetStore } from '@features/snippets/store/snippetStore';

interface CardHeaderProps {
  username: string;
  language: string;
  snippetId: number;
  userId?: number;
}

export default function CardHeader({ username, language, snippetId, userId }: CardHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteSnippet, isDeleting } = useDeleteSnippet();
  const confirmModal = useConfirmModal();
  const setShowActions = useSnippetStore(state => state.setShowActions);
  const showActions = useSnippetStore(state => state.showActions);

  useEffect(() => {
    if (location.pathname === '/my-snippets') {
      setShowActions(true);
    } else {
      setShowActions(false);
    }
  }, [location.pathname, setShowActions]);

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
        <Link to={`/users/${userId}`} className="flex items-center text-sm gap-2">
          <FaUser />
          <span>{username}</span>
        </Link>
        <div className="flex items-center text-sm gap-2">
          {showActions && (
            <EditDeleteActions
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              editTitle="Edit snippet"
              deleteTitle="Delete snippet"
              className="gap-4 mr-2"
            />
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
