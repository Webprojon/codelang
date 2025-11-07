import { useQuery } from '@tanstack/react-query';
import { getLanguages } from '../api/snippetApi';

export const useLanguages = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return {
    languages: data || [],
    isLoading,
    error,
  };
};
