import QuestionCard from './QuestionCard';
import { LoadingSpinner } from '../../../../shared/components/feedback';
import type { Question } from '../../types';

interface QuestionsListProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

export default function QuestionsList({ questions, isLoading, error }: QuestionsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">No questions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
