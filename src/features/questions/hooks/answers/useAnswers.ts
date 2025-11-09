import { useMemo } from 'react';
import type { Answer, Question } from '@features/questions/types';

export interface UseAnswersReturn {
  answers: Answer[];
  totalAnswers: number;
}

/**
 * Hook to extract and work with answers from a question
 * Follows single responsibility principle - handles answer-related logic
 */
export const useAnswers = (question: Question | null | undefined): UseAnswersReturn => {
  const answers = useMemo(() => {
    if (!question) return [];
    return question.answers || [];
  }, [question]);

  return {
    answers,
    totalAnswers: answers.length,
  };
};
