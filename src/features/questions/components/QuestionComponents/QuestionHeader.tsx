import { Link } from 'react-router-dom';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import Target from '@assets/icons/target.png';
import type { Question } from '@features/questions/types';

interface QuestionHeaderProps {
  question: Question;
}

export default function QuestionHeader({ question }: QuestionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 bg-gray-100 p-2 rounded border border-gray-200">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <img src={Target} alt="Target" className="size-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-500">{question.title}</h1>
            {question.isResolved ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <IoCheckmarkCircle className="size-4" />
                Resolved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                <IoCloseCircle className="size-4" />
                Open
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Asked by{' '}
            <Link to={`/users/${question.user?.id}`} className="uppercase">
              {question.user?.username || 'Unknown'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
