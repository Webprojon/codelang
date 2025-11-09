import type { ApiComment } from '../../types';
import CommentEditForm from './CommentEditForm';
import CommentHeader from './CommentHeader';
import { useCommentStore } from '../../store/commentStore';

interface CommentItemProps {
  comment: ApiComment;
  isOwner: boolean;
}

export default function CommentItem({ comment, isOwner }: CommentItemProps) {
  const {
    editingCommentId,
    editContent,
    isUpdating,
    onSaveEdit,
    onCancelEdit,
    onEditContentChange,
  } = useCommentStore();

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
        />
        {isEditing ? (
          <CommentEditForm
            content={editContent}
            onContentChange={content => onEditContentChange?.(content)}
            onSave={() => onSaveEdit?.(comment.id)}
            onCancel={() => onCancelEdit?.()}
            isSaving={isUpdating}
          />
        ) : (
          <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
        )}
      </div>
    </div>
  );
}
