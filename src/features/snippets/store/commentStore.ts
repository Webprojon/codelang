import { create } from 'zustand';

interface CommentState {
  editingCommentId: string | null;
  editContent: string;
  setEditingCommentId: (commentId: string | null) => void;
  setEditContent: (content: string) => void;
  reset: () => void;
}

export const useCommentStore = create<CommentState>()(set => ({
  editingCommentId: null,
  editContent: '',
  setEditingCommentId: (commentId: string | null) =>
    set(state => {
      if (state.editingCommentId === commentId) return state;
      return { editingCommentId: commentId };
    }),
  setEditContent: (content: string) =>
    set(state => {
      if (state.editContent === content) return state;
      return { editContent: content };
    }),
  reset: () =>
    set({
      editingCommentId: null,
      editContent: '',
    }),
}));
