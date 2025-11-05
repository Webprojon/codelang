import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from '../../../shared/components/Select';
import CodeEditor from '../../../shared/components/CodeEditor';
import Button from '../../../shared/components/Button';

interface PostSnippetFormData {
  language: string;
  code: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
];

export default function PostSnippetPage() {
  const [code, setCode] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostSnippetFormData>({
    mode: 'onChange',
    defaultValues: {
      language: 'javascript',
      code: '',
    },
  });

  const selectedLanguage = watch('language');

  const onSubmit = (data: PostSnippetFormData) => {
    if (!code.trim()) {
      return;
    }
    console.log('Submit:', { ...data, code });
    // TODO: Implement API call
  };

  const selectClasses = 'text-black placeholder:text-gray-400 focus:border-brand-500';

  return (
    <div className="mx-4">
      <h1 className="text-2xl font-bold text-center mb-10">Create new snippet!</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="language" className="text-sm font-bold block mb-2">
            Language of your snippet:
          </label>
          <Select
            id="language"
            options={LANGUAGE_OPTIONS}
            error={errors.language?.message}
            selectClassName={selectClasses}
            value={selectedLanguage}
            {...register('language', {
              required: 'Please select a language',
            })}
          />
        </div>

        <div>
          <label htmlFor="code" className="text-base font-bold">
            Code of your snippet:
          </label>
          <div className="mt-2 border border-gray-300">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage || 'javascript'}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-2 bg-brand-700 text-slate-300 hover:bg-brand-500 uppercase tracking-wide"
        >
          Create snippet
        </Button>
      </form>
    </div>
  );
}
