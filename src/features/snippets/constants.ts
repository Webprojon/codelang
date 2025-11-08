export interface LanguageOption {
  value: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'C/C++', label: 'C/C++' },
  { value: 'C#', label: 'C#' },
  { value: 'Go', label: 'Go' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Ruby', label: 'Ruby' },
] as const;

export const DEFAULT_LANGUAGE = 'JavaScript' as const;

export const SNIPPETS_ENDPOINT = '/snippets' as const;

export const DEFAULT_SORT_BY = 'id:ASC' as const;
