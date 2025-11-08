import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { getMarkColor } from './utils';
import { MarkType } from '../../types';

interface MarkButtonProps {
  type: MarkType;
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
  const Icon = type === MarkType.LIKE ? FaThumbsUp : FaThumbsDown;
  const colorClass = getMarkColor(isActive);

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 transition-all ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      aria-label={type === MarkType.LIKE ? 'Like' : 'Dislike'}
    >
      <Icon className={`text-sm ${colorClass}`} />
      <span className={`text-sm font-medium ${colorClass}`}>{count}</span>
    </button>
  );
}
