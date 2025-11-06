import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markSnippet } from '../services/snippetService';
import { useAuthStore } from '../../auth/store/authStore';
import type { SnippetsResponse } from '../types';

export const useMarkSnippet = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: ({ id, mark }: { id: number; mark: 'like' | 'dislike' }) => markSnippet(id, mark),
    onMutate: async ({ id, mark }) => {
      await queryClient.cancelQueries({ queryKey: ['snippets'] });

      const previousQueries = queryClient.getQueriesData<SnippetsResponse>({
        queryKey: ['snippets'],
      });

      queryClient.setQueriesData<SnippetsResponse>({ queryKey: ['snippets'] }, oldData => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          snippets: oldData.snippets.map(snippet => {
            if (snippet.id === id) {
              const currentLikes = snippet.likes || 0;
              const currentDislikes = snippet.dislikes || 0;
              const currentMark = snippet.currentUserMark;

              if (mark === 'like') {
                if (currentMark === 'like') {
                  return {
                    ...snippet,
                    likes: Math.max(0, currentLikes - 1),
                    currentUserMark: null,
                  };
                } else if (currentMark === 'dislike') {
                  return {
                    ...snippet,
                    likes: currentLikes + 1,
                    dislikes: Math.max(0, currentDislikes - 1),
                    currentUserMark: 'like',
                  };
                } else {
                  return {
                    ...snippet,
                    likes: currentLikes + 1,
                    currentUserMark: 'like',
                  };
                }
              } else {
                if (currentMark === 'dislike') {
                  return {
                    ...snippet,
                    dislikes: Math.max(0, currentDislikes - 1),
                    currentUserMark: null,
                  };
                } else if (currentMark === 'like') {
                  return {
                    ...snippet,
                    likes: Math.max(0, currentLikes - 1),
                    dislikes: currentDislikes + 1,
                    currentUserMark: 'dislike',
                  };
                } else {
                  return {
                    ...snippet,
                    dislikes: currentDislikes + 1,
                    currentUserMark: 'dislike',
                  };
                }
              }
            }
            return snippet;
          }),
        };
      });

      return { previousQueries };
    },
    onError: (error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Failed to mark snippet:', error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['snippets'],
        refetchType: 'active',
      });

      queryClient.invalidateQueries({
        queryKey: ['snippet', variables.id],
        refetchType: 'active',
      });

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ['userStatistics', user.id],
          refetchType: 'active',
        });
      }
    },
  });

  return {
    markSnippet: mutation.mutate,
    isMarking: mutation.isPending,
    error: mutation.error,
  };
};
