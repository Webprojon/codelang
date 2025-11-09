import AnswerItem from './AnswerItem';
import type { Answer } from '../../types';
import { useAuthStore } from '../../../auth/store/authStore';
import { useAnswerStore } from '../../store/answerStore';

interface AnswersListProps {
  answers: Answer[];
  isDeleting: boolean;
  isUpdating: boolean;
}

export default function AnswersList({ answers, isDeleting, isUpdating }: AnswersListProps) {
  const currentUser = useAuthStore(state => state.user);
  const { editingAnswerId } = useAnswerStore();

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
          />
        );
      })}
    </div>
  );
}
