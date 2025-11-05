import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { getMarkColor } from './utils';

interface MarkButtonProps {
  type: 'like' | 'dislike';
  count: number;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export default function MarkButton({
  type,
  count,
  isActive,
  isDisabled,
  onClick,
}: MarkButtonProps) {
  const Icon = type === 'like' ? FaThumbsUp : FaThumbsDown;
  const colorClass = getMarkColor(isActive);

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 transition-all ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      aria-label={type === 'like' ? 'Like' : 'Dislike'}
    >
      <Icon className={`text-sm ${colorClass}`} />
      <span className={`text-sm font-medium ${colorClass}`}>{count}</span>
    </button>
  );
}
