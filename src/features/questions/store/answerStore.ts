import { create } from 'zustand';

interface AnswerState {
  editingAnswerId: number | null;
  onEdit: ((answerId: number) => void) | null;
  onDelete: ((answerId: number) => void) | null;
  setEditingAnswerId: (answerId: number | null) => void;
  setOnEdit: (onEdit: ((answerId: number) => void) | null) => void;
  setOnDelete: (onDelete: ((answerId: number) => void) | null) => void;
  reset: () => void;
}

export const useAnswerStore = create<AnswerState>()(set => ({
  editingAnswerId: null,
  onEdit: null,
  onDelete: null,
  setEditingAnswerId: (answerId: number | null) =>
    set(state => {
      if (state.editingAnswerId === answerId) return state;
      return { editingAnswerId: answerId };
    }),
  setOnEdit: (onEdit: ((answerId: number) => void) | null) =>
    set(state => {
      if (state.onEdit === onEdit) return state;
      return { onEdit };
    }),
  setOnDelete: (onDelete: ((answerId: number) => void) | null) =>
    set(state => {
      if (state.onDelete === onDelete) return state;
      return { onDelete };
    }),
  reset: () =>
    set({
      editingAnswerId: null,
      onEdit: null,
      onDelete: null,
    }),
}));
