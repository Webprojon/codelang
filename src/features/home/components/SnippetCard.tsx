import { FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { RiCodeBoxLine } from 'react-icons/ri';
import { LiaComments } from 'react-icons/lia';
import CodeEditor from '../../../shared/components/CodeEditor';
import type { Snippet } from '../../snippets/types';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const username = snippet.username || 'Anonymous';
  const language = snippet.language || 'javascript';
  const likes = snippet.likes || 0;
  const dislikes = snippet.dislikes || 0;
  const comments = snippet.comments || 0;

  const languageDisplay =
    language.charAt(0).toUpperCase() +
    language.slice(1).replace('cpp', 'C++').replace('c++', 'C++');

  return (
    <div className="border border-gray-300 text-gray-500 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center text-sm gap-2">
          <FaUser />
          <span>{username}</span>
        </div>
        <div className="flex items-center test-sm gap-2">
          <RiCodeBoxLine />
          <span>{languageDisplay}</span>
        </div>
      </div>

      <CodeEditor value={snippet.content} onChange={() => {}} language={language} readOnly={true} />

      <div className="p-3 border-t border-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center text-sm gap-1.5">
            <FaThumbsUp className="text-red-500 text-sm" />
            <span className="text-sm text-red-500">{likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaThumbsDown className="text-amber-800 text-sm" />
            <span className="text-sm text-amber-800">{dislikes}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-gray-400">{comments}</span>
          <LiaComments className="text-amber-700" />
        </div>
      </div>
    </div>
  );
}
