import QuestionCard from '@features/questions/components/QuestionComponents/QuestionCard';
import { LoadingContainer } from '@shared/components/feedback';
import type { Question } from '@features/questions/types';

interface QuestionsListProps {
  questions: Question[];
  error: string | null;
}

export default function QuestionsList({ questions, error }: QuestionsListProps) {
  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <LoadingContainer />;
  }

  return (
    <div className="space-y-6">
      {questions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
