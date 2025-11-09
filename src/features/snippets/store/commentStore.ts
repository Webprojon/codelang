import { create } from 'zustand';

interface CommentState {
  editingCommentId: string | null;
  editContent: string;
  isUpdating: boolean;
  isDeleting: boolean;
  onEditClick: ((commentId: string) => void) | null;
  onDeleteClick: ((commentId: string) => void) | null;
  onSaveEdit: ((commentId: string) => void) | null;
  onCancelEdit: (() => void) | null;
  onEditContentChange: ((content: string) => void) | null;
  setEditingCommentId: (commentId: string | null) => void;
  setEditContent: (content: string) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setOnEditClick: (onEditClick: ((commentId: string) => void) | null) => void;
  setOnDeleteClick: (onDeleteClick: ((commentId: string) => void) | null) => void;
  setOnSaveEdit: (onSaveEdit: ((commentId: string) => void) | null) => void;
  setOnCancelEdit: (onCancelEdit: (() => void) | null) => void;
  setOnEditContentChange: (onEditContentChange: ((content: string) => void) | null) => void;
  reset: () => void;
}

export const useCommentStore = create<CommentState>()(set => ({
  editingCommentId: null,
  editContent: '',
  isUpdating: false,
  isDeleting: false,
  onEditClick: null,
  onDeleteClick: null,
  onSaveEdit: null,
  onCancelEdit: null,
  onEditContentChange: null,
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
  setIsUpdating: (isUpdating: boolean) =>
    set(state => {
      if (state.isUpdating === isUpdating) return state;
      return { isUpdating };
    }),
  setIsDeleting: (isDeleting: boolean) =>
    set(state => {
      if (state.isDeleting === isDeleting) return state;
      return { isDeleting };
    }),
  setOnEditClick: (onEditClick: ((commentId: string) => void) | null) =>
    set(state => {
      if (state.onEditClick === onEditClick) return state;
      return { onEditClick };
    }),
  setOnDeleteClick: (onDeleteClick: ((commentId: string) => void) | null) =>
    set(state => {
      if (state.onDeleteClick === onDeleteClick) return state;
      return { onDeleteClick };
    }),
  setOnSaveEdit: (onSaveEdit: ((commentId: string) => void) | null) =>
    set(state => {
      if (state.onSaveEdit === onSaveEdit) return state;
      return { onSaveEdit };
    }),
  setOnCancelEdit: (onCancelEdit: (() => void) | null) =>
    set(state => {
      if (state.onCancelEdit === onCancelEdit) return state;
      return { onCancelEdit };
    }),
  setOnEditContentChange: (onEditContentChange: ((content: string) => void) | null) =>
    set(state => {
      if (state.onEditContentChange === onEditContentChange) return state;
      return { onEditContentChange };
    }),
  reset: () =>
    set({
      editingCommentId: null,
      editContent: '',
      isUpdating: false,
      isDeleting: false,
      onEditClick: null,
      onDeleteClick: null,
      onSaveEdit: null,
      onCancelEdit: null,
      onEditContentChange: null,
    }),
}));
