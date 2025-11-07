import { Button } from '../../../../shared/components/ui';

interface CommentEditFormProps {
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function CommentEditForm({
  content,
  onContentChange,
  onSave,
  onCancel,
  isSaving,
}: CommentEditFormProps) {
  return (
    <div className="ml-10 mt-2">
      <textarea
        value={content}
        onChange={e => onContentChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 resize-none"
        rows={2}
        disabled={isSaving}
      />
      <div className="flex gap-2 mt-2">
        <Button
          onClick={onSave}
          disabled={isSaving || !content.trim()}
          className="cursor-pointer px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          disabled={isSaving}
          className="cursor-pointer px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
