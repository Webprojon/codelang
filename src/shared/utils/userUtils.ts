export const getFirstLetter = (username: string): string => {
  if (!username || username.length === 0) {
    return '';
  }
  return username.charAt(0).toUpperCase();
};

export const isSameUser = (
  userId1: string | number | undefined,
  userId2: number | undefined
): boolean => {
  if (userId1 === undefined || userId2 === undefined) {
    return false;
  }

  const id1 = typeof userId1 === 'string' ? parseInt(userId1, 10) : userId1;
  return id1 === userId2 || userId1.toString() === userId2.toString();
};
