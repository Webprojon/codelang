import type { ApiComment } from '@features/snippets/types';
import CommentEditForm from '@features/snippets/components/Comments/CommentEditForm';
import CommentHeader from '@features/snippets/components/Comments/CommentHeader';
import { useCommentStore } from '@features/snippets/store/commentStore';

interface CommentItemProps {
  comment: ApiComment;
  isOwner: boolean;
  onEditClick: (comment: ApiComment) => void;
  onDeleteClick: (commentId: string) => void;
  onSaveEdit: (commentId: string) => void;
  onCancelEdit: () => void;
  onEditContentChange: (content: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function CommentItem({
  comment,
  isOwner,
  onEditClick,
  onDeleteClick,
  onSaveEdit,
  onCancelEdit,
  onEditContentChange,
  isUpdating,
  isDeleting,
}: CommentItemProps) {
  const { editingCommentId, editContent } = useCommentStore();

  const isEditing = editingCommentId === comment.id;

  return (
    <div className="px-4 py-3">
      <div className="flex flex-col">
        <CommentHeader
          username={comment.user.username}
          userId={comment.user.id}
          commentId={comment.id}
          isOwner={isOwner}
          isEditing={isEditing}
          onEditClick={() => onEditClick(comment)}
          onDeleteClick={() => onDeleteClick(comment.id)}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
        {isEditing ? (
          <CommentEditForm
            content={editContent}
            onContentChange={onEditContentChange}
            onSave={() => onSaveEdit(comment.id)}
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

export default CommentItem;
