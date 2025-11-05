export interface LanguageOption {
  value: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
] as const;

export const DEFAULT_LANGUAGE = 'javascript' as const;

export const SNIPPETS_ENDPOINT = '/snippets' as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 15;
export const DEFAULT_SORT_BY = 'id:ASC' as const;
