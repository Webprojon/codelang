import { DEFAULT_LANGUAGE } from '@features/snippets/constants';

export const COPY_SUCCESS_TIMEOUT = 2000;
export const DEFAULT_USERNAME = 'Anonymous';

export const formatLanguage = (language: string): string => {
  return language;
};

export const getMarkColor = (isActive: boolean): string => {
  return isActive ? 'text-red-500' : 'text-gray-500 dark:text-gray-400';
};

export { DEFAULT_LANGUAGE };
