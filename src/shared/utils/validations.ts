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

export const TITLE_VALIDATION = {
  required: 'Title is required',
  minLength: {
    value: 3,
    message: 'Title must be at least 3 characters',
  },
} as const;

export const DESCRIPTION_VALIDATION = {
  required: 'Description is required',
  minLength: {
    value: 10,
    message: 'Description must be at least 10 characters',
  },
} as const;

export const CONTENT_VALIDATION = {
  required: 'Content is required',
  minLength: {
    value: 10,
    message: 'Content must be at least 10 characters',
  },
} as const;

export const ANSWER_CONTENT_VALIDATION = {
  required: 'Answer content is required',
  minLength: {
    value: 10,
    message: 'Answer must be at least 10 characters',
  },
} as const;

export const CODE_VALIDATION = {
  required: 'Code is required',
  validate: (value: string) => {
    const trimmed = value.trim();
    return trimmed.length > 0 || 'Code cannot be empty';
  },
} as const;

export const LANGUAGE_VALIDATION = {
  required: 'Please select a language',
} as const;
