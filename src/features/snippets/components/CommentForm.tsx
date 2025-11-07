import { useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { Button } from '../../../shared/components/ui';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export default function CommentForm({ onSubmit, isSubmitting, error }: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) {
      return;
    }

    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative border-t border-gray-300 p-4">
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <div className="relative min-h-[60px]">
        <label
          htmlFor="comment-input"
          className="absolute top-2 left-2 text-sm tracking-wider font-bold text-gray-400 pointer-events-none z-10"
        >
          Add your comment
        </label>

        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="absolute bottom-2 right-2 px-8 p-3 cursor-pointer bg-blue-500 rounded-sm flex items-center justify-center text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-20 shadow-sm"
          aria-label="Submit comment"
          icon={<BsFillSendFill className="w-4 h-4" />}
        />

        <div className="pt-8 px-2 pb-2 pr-12">
          <input
            type="text"
            placeholder="Write here..."
            id="comment-input"
            value={content}
            disabled={isSubmitting}
            onChange={e => setContent(e.target.value)}
            className="border-b border-blue-500 py-2 w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 disabled:opacity-50"
          />
        </div>
      </div>
    </form>
  );
}
