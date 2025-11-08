import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../auth/store/authStore';
import { useDeleteQuestion } from '../../hooks/questions';
import { useConfirmModal } from '../../../../shared/hooks/useConfirmModal';
import { ConfirmModal } from '../../../../shared/components/feedback';
import EditDeleteActions from '../../../../shared/components/ui/EditDeleteActions';
import toast from 'react-hot-toast';
import type { Question } from '../../types';
import Target from '../../../../assets/icons/target.png';
import { IoEyeSharp } from 'react-icons/io5';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.user);
  const { deleteQuestion, isDeleting } = useDeleteQuestion();
  const confirmModal = useConfirmModal();

  const username = question.user?.username || 'Unknown';
  const description = question.description || 'No description provided';
  const isCurrentUserQuestion = currentUser?.id === question.user?.id;

  const handleDelete = async () => {
    confirmModal.showConfirm('Are you sure you want to delete this question?', async () => {
      try {
        await deleteQuestion(question.id);
        toast.success('Question deleted successfully');
      } catch (error) {
        console.error('Failed to delete question:', error);
        toast.error('Failed to delete question');
      }
    });
  };

  const handleEdit = () => {
    navigate(`/questions/${question.id}/edit`);
  };

  return (
    <>
      <div className="relative rounded-lg border border-gray-200 p-4 shadow-auth hover:shadow-lg transition-shadow">
        <div className="flex items-start flex-col gap-2">
          <div className="shrink-0 mt-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <img src={Target} alt="Target" className="size-5" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-500 flex-1">{question.title}</h3>
              <p className="text-sm text-gray-500">
                asked by user:{' '}
                <span className="font-medium uppercase">
                  <Link to={`/users/${question.user?.id}`}>{username}</Link>
                </span>
              </p>
            </div>
          </div>

          <div className="absolute top-6 right-6">
            {isCurrentUserQuestion && (
              <EditDeleteActions
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                editTitle="Edit question"
                deleteTitle="Delete question"
                className="gap-3"
              />
            )}
          </div>

          <>
            <p className="text-sm text-gray-700 mb-2 mt-1 line-clamp-2">{description}</p>
            <Link
              to={`/questions/${question.id}`}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <IoEyeSharp className="size-5" />
            </Link>
          </>
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
