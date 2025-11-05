import { LiaComments } from 'react-icons/lia';
import type { Snippet } from '../../types';
import MarkButton from './MarkButton';

interface CardFooterProps {
  snippet: Snippet;
  onMark: (mark: 'like' | 'dislike') => void;
  isMarking: boolean;
}

export default function CardFooter({ snippet, onMark, isMarking }: CardFooterProps) {
  const likes = snippet.likes || 0;
  const dislikes = snippet.dislikes || 0;
  const comments = snippet.comments || 0;

  return (
    <div className="px-3 py-2 border-t border-gray-300 flex items-center justify-between">
      <div className="flex items-center">
        <MarkButton
          type="like"
          count={likes}
          isActive={snippet.currentUserMark === 'like'}
          isDisabled={isMarking}
          onClick={() => !isMarking && onMark('like')}
        />
        <MarkButton
          type="dislike"
          count={dislikes}
          isActive={snippet.currentUserMark === 'dislike'}
          isDisabled={isMarking}
          onClick={() => !isMarking && onMark('dislike')}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-sm text-gray-400">{comments}</span>
        <LiaComments className="text-amber-700 cursor-pointer" />
      </div>
    </div>
  );
}
