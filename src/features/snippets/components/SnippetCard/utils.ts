export const COPY_SUCCESS_TIMEOUT = 2000;
export const DEFAULT_LANGUAGE = 'javascript';
export const DEFAULT_USERNAME = 'Anonymous';

export const formatLanguage = (language: string): string => {
  return language.charAt(0).toUpperCase() + language.slice(1).replace(/cpp|C\+\+/gi, 'C++');
};

export const getMarkColor = (isActive: boolean): string => {
  return isActive ? 'text-red-500' : 'text-gray-500 dark:text-gray-400';
};
