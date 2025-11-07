import { useState } from 'react';
import { TbCopy } from 'react-icons/tb';
import { MdCheck } from 'react-icons/md';
import CodeEditor from '../../../../shared/components/ui/CodeEditor';
import Button from '../../../../shared/components/ui/Button';
import { COPY_SUCCESS_TIMEOUT } from './utils';

interface CodeSectionProps {
  content: string;
  language: string;
}

export default function CodeSection({ content, language }: CodeSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_SUCCESS_TIMEOUT);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <CodeEditor value={content} onChange={() => {}} language={language} readOnly={true} />
      <Button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 cursor-pointer"
        color="ghost"
        size="md"
        aria-label="Copy code"
        icon={
          copied ? (
            <MdCheck className="text-green-600 size-5" />
          ) : (
            <TbCopy className="text-gray-600" />
          )
        }
      />
    </div>
  );
}
