import type { Answer, Question } from '@features/questions/types';

export interface UseAnswersReturn {
  answers: Answer[];
  totalAnswers: number;
}

export const useAnswers = (question: Question | null | undefined): UseAnswersReturn => {
  const answers = question?.answers || [];

  return {
    answers,
    totalAnswers: answers.length,
  };
};
