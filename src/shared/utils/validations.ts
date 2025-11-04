export const PASSWORD_VALIDATION = {
  required: 'Password is required',
  minLength: { value: 6, message: 'Password must be at least 6 characters' },
  maxLength: { value: 128, message: 'Password must be less than 128 characters' },
  validate: {
    hasLetter: (value?: string) =>
      value ? /[a-zA-Z]/.test(value) || 'Password must contain at least one letter' : true,
    hasNumber: (value?: string) =>
      value ? /[0-9]/.test(value) || 'Password must contain at least one number' : true,
  },
};

export const USERNAME_VALIDATION = {
  required: 'Username is required',
  minLength: { value: 5, message: 'Username must be longer than or equal to 5 characters' },
  maxLength: { value: 30, message: 'Username must be less than 30 characters' },
  pattern: {
    value: /^[a-zA-Z0-9_-]+$/,
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  },
};
