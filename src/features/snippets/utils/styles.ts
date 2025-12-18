export const SNIPPET_STYLES = {
  card: 'border-2 border-gray-300 text-gray-500 rounded-lg overflow-hidden',
  cardHeader: 'px-3 py-2 border-b border-gray-300 flex items-center justify-between',
  cardFooter: 'px-3 py-2 border-t border-gray-300 flex items-center justify-between',
  select: 'text-black placeholder:text-gray-400 focus:border-brand-500',
  codeEditorWrapper: 'mt-2 border border-gray-300',
  submitButton:
    'w-full py-2 bg-brand-700 text-slate-300 hover:bg-brand-500 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed',
  errorMessage: 'mb-4 error-message',
  editButton: 'text-gray-500 hover:text-blue-500 transition-colors cursor-pointer',
  deleteButton: 'text-gray-500 hover:text-red-500 transition-colors cursor-pointer',
  loadingContainer: 'flex items-center justify-center min-h-[400px]',
  errorContainer: 'flex flex-col items-center justify-center min-h-[400px] gap-4',
} as const;
