import { Link } from 'react-router-dom';
import type { ApiComment } from '../../types';

interface CommentsListProps {
  comments: ApiComment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="px-4 py-3 border-t border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-400">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">Comments ({comments.length})</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {comments.map(comment => (
          <div key={comment.id} className="px-4 py-3">
            <div className="flex flex-col">
              <Link
                to={`/users/${comment.user.id}`}
                className="w-fit flex items-center gap-2 font-bold text-gray-500"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  {comment.user.username.charAt(0).toUpperCase()}
                </div>
                <span>{comment.user.username}</span>
              </Link>
              <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
