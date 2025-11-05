import { useState } from 'react';
import { createSnippet } from '../services/snippetService';
import type { PostSnippetRequest } from '../types';

interface UsePostSnippetReturn {
  isSubmitting: boolean;
  error: string | null;
  submitSnippet: (request: PostSnippetRequest) => Promise<void>;
}

export const usePostSnippet = (): UsePostSnippetReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitSnippet = async (request: PostSnippetRequest): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createSnippet(request);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create snippet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    submitSnippet,
  };
};
