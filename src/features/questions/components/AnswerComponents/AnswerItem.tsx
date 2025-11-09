import { memo } from 'react';
import { Link } from 'react-router-dom';
import { getFirstLetter } from '@shared/utils/userUtils';
import EditDeleteActions from '@shared/components/ui/EditDeleteActions';
import { useAnswerStore } from '@features/questions/store/answerStore';
import type { Answer } from '@features/questions/types';

interface AnswerItemProps {
  answer: Answer;
  isCurrentUserAnswer: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
}

function AnswerItem({
  answer,
  isCurrentUserAnswer,
  isEditing,
  isDeleting,
  isUpdating,
}: AnswerItemProps) {
  const { onEdit, onDelete } = useAnswerStore();
  return (
    <div
      className={`rounded-lg p-4 shadow-md hover:shadow-lg border ${
        isCurrentUserAnswer ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {getFirstLetter(answer.user?.username)}
            </span>
          </div>
          <div>
            <Link to={`/users/${answer.user?.id}`} className="font-medium text-gray-600">
              {answer.user?.username}
            </Link>
            {isCurrentUserAnswer && (
              <span className="ml-2 text-xs text-blue-600 font-medium">(Your answer)</span>
            )}
          </div>
        </div>
        {isCurrentUserAnswer && onEdit && onDelete && (
          <EditDeleteActions
            onEdit={() => onEdit(answer.id)}
            onDelete={() => onDelete(answer.id)}
            isDeleting={isDeleting}
            isUpdating={isUpdating || isEditing}
            editTitle="Edit answer"
            deleteTitle="Delete answer"
            className="gap-4 mr-2"
          />
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{answer.content}</p>
    </div>
  );
}

export default memo(AnswerItem, (prevProps, nextProps) => {
  return (
    prevProps.answer.id === nextProps.answer.id &&
    prevProps.answer.content === nextProps.answer.content &&
    prevProps.answer.user?.id === nextProps.answer.user?.id &&
    prevProps.isCurrentUserAnswer === nextProps.isCurrentUserAnswer &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.isDeleting === nextProps.isDeleting &&
    prevProps.isUpdating === nextProps.isUpdating
  );
});
