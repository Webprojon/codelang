import type { ApiComment } from '../../types';
import CommentEditForm from './CommentEditForm';
import CommentHeader from './CommentHeader';

interface CommentItemProps {
  comment: ApiComment;
  isOwner: boolean;
  isEditing: boolean;
  editContent: string;
  isUpdating: boolean;
  isDeleting: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditContentChange: (content: string) => void;
}

export default function CommentItem({
  comment,
  isOwner,
  isEditing,
  editContent,
  isUpdating,
  isDeleting,
  onEditClick,
  onDeleteClick,
  onSaveEdit,
  onCancelEdit,
  onEditContentChange,
}: CommentItemProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex flex-col">
        <CommentHeader
          username={comment.user.username}
          userId={comment.user.id}
          isOwner={isOwner}
          isEditing={isEditing}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
        {isEditing ? (
          <CommentEditForm
            content={editContent}
            onContentChange={onEditContentChange}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
            isSaving={isUpdating}
          />
        ) : (
          <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
        )}
      </div>
    </div>
  );
}
