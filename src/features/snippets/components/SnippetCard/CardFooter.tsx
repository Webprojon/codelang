import { useNavigate } from 'react-router-dom';
import { LiaComments } from 'react-icons/lia';
import type { Snippet } from '../../types';
import MarkButton from './MarkButton';
import { SNIPPET_STYLES } from '../../utils/styles';

interface CardFooterProps {
  snippet: Snippet;
  onMark: (mark: 'like' | 'dislike') => void;
  isMarking: boolean;
  onToggleComments?: () => void;
}

export default function CardFooter({
  snippet,
  onMark,
  isMarking,
  onToggleComments,
}: CardFooterProps) {
  const navigate = useNavigate();
  const likes = snippet.likes || 0;
  const dislikes = snippet.dislikes || 0;
  const comments = snippet.comments || 0;

  const handleCommentsClick = () => {
    if (onToggleComments) {
      onToggleComments();
    } else {
      navigate(`/snippets/${snippet.id}`);
    }
  };

  return (
    <div className={SNIPPET_STYLES.cardFooter}>
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
        <LiaComments
          className="text-amber-700 cursor-pointer hover:text-amber-800 transition-colors"
          onClick={handleCommentsClick}
        />
      </div>
    </div>
  );
}
