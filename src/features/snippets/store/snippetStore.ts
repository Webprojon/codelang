import { create } from 'zustand';

interface SnippetState {
  showActions: boolean;
  setShowActions: (show: boolean) => void;
}

export const useSnippetStore = create<SnippetState>()(set => ({
  showActions: false,
  setShowActions: (show: boolean) =>
    set({
      showActions: show,
    }),
}));
