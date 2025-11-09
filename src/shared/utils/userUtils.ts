export const getFirstLetter = (username: string): string => {
  if (!username || username.length === 0) {
    return '';
  }
  return username.charAt(0).toUpperCase();
};
