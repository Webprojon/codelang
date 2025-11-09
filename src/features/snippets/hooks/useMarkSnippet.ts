import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markSnippet } from '@features/snippets/api/snippetApi';
import { useAuthStore } from '@features/auth/store/authStore';
import type { SnippetsResponse } from '@features/snippets/types';
import { MarkType } from '@features/snippets/types';

export const useMarkSnippet = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const mutation = useMutation({
    mutationFn: ({ id, mark }: { id: number; mark: MarkType }) => markSnippet(id, mark),
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

              if (mark === MarkType.LIKE) {
                if (currentMark === MarkType.LIKE) {
                  return {
                    ...snippet,
                    likes: Math.max(0, currentLikes - 1),
                    currentUserMark: null,
                  };
                } else if (currentMark === MarkType.DISLIKE) {
                  return {
                    ...snippet,
                    likes: currentLikes + 1,
                    dislikes: Math.max(0, currentDislikes - 1),
                    currentUserMark: MarkType.LIKE,
                  };
                } else {
                  return {
                    ...snippet,
                    likes: currentLikes + 1,
                    currentUserMark: MarkType.LIKE,
                  };
                }
              } else {
                if (currentMark === MarkType.DISLIKE) {
                  return {
                    ...snippet,
                    dislikes: Math.max(0, currentDislikes - 1),
                    currentUserMark: null,
                  };
                } else if (currentMark === MarkType.LIKE) {
                  return {
                    ...snippet,
                    likes: Math.max(0, currentLikes - 1),
                    dislikes: currentDislikes + 1,
                    currentUserMark: MarkType.DISLIKE,
                  };
                } else {
                  return {
                    ...snippet,
                    dislikes: currentDislikes + 1,
                    currentUserMark: MarkType.DISLIKE,
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
