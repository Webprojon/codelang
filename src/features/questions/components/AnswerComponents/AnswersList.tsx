import AnswerItem from './AnswerItem';
import type { Answer } from '../../types';
import type { User } from '../../../auth/types';

interface AnswersListProps {
  answers: Answer[];
  currentUser: User | null;
  editingAnswerId: number | null;
  isDeleting: boolean;
  isUpdating: boolean;
  onEdit: (answerId: number) => void;
  onDelete: (answerId: number) => void;
}

export default function AnswersList({
  answers,
  currentUser,
  editingAnswerId,
  isDeleting,
  isUpdating,
  onEdit,
  onDelete,
}: AnswersListProps) {
  if (answers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No answers yet. Be the first to answer this question!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {answers.map(answer => {
        const isCurrentUserAnswer = currentUser?.id === answer.user?.id;
        return (
          <AnswerItem
            key={answer.id}
            answer={answer}
            isCurrentUserAnswer={isCurrentUserAnswer}
            isEditing={editingAnswerId === answer.id}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
