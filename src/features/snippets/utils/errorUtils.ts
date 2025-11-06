export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = 'An error occurred'
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
