import { PASSWORD_VALIDATION, USERNAME_VALIDATION } from '../validations';

describe('validations', () => {
  describe('PASSWORD_VALIDATION', () => {
    describe('required', () => {
      it('should return error message when password is empty', () => {
        expect(PASSWORD_VALIDATION.required).toBe('Password is required');
      });
    });

    describe('minLength', () => {
      it('should have correct minLength value and message', () => {
        expect(PASSWORD_VALIDATION.minLength.value).toBe(6);
        expect(PASSWORD_VALIDATION.minLength.message).toBe(
          'Password must be at least 6 characters'
        );
      });
    });

    describe('maxLength', () => {
      it('should have correct maxLength value and message', () => {
        expect(PASSWORD_VALIDATION.maxLength.value).toBe(128);
        expect(PASSWORD_VALIDATION.maxLength.message).toBe(
          'Password must be less than 128 characters'
        );
      });
    });

    describe('validate.hasLetter', () => {
      it('should return true for password with letter', () => {
        const result = PASSWORD_VALIDATION.validate.hasLetter('password123');
        expect(result).toBe(true);
      });

      it('should return error message for password without letter', () => {
        const result = PASSWORD_VALIDATION.validate.hasLetter('123456');
        expect(result).toBe('Password must contain at least one letter');
      });

      it('should return true for empty value', () => {
        const result = PASSWORD_VALIDATION.validate.hasLetter(undefined);
        expect(result).toBe(true);
      });
    });

    describe('validate.hasNumber', () => {
      it('should return true for password with number', () => {
        const result = PASSWORD_VALIDATION.validate.hasNumber('password123');
        expect(result).toBe(true);
      });

      it('should return error message for password without number', () => {
        const result = PASSWORD_VALIDATION.validate.hasNumber('password');
        expect(result).toBe('Password must contain at least one number');
      });

      it('should return true for empty value', () => {
        const result = PASSWORD_VALIDATION.validate.hasNumber(undefined);
        expect(result).toBe(true);
      });
    });
  });

  describe('USERNAME_VALIDATION', () => {
    describe('required', () => {
      it('should return error message when username is empty', () => {
        expect(USERNAME_VALIDATION.required).toBe('Username is required');
      });
    });

    describe('minLength', () => {
      it('should have correct minLength value and message', () => {
        expect(USERNAME_VALIDATION.minLength.value).toBe(5);
        expect(USERNAME_VALIDATION.minLength.message).toBe(
          'Username must be longer than or equal to 5 characters'
        );
      });
    });

    describe('maxLength', () => {
      it('should have correct maxLength value and message', () => {
        expect(USERNAME_VALIDATION.maxLength.value).toBe(30);
        expect(USERNAME_VALIDATION.maxLength.message).toBe(
          'Username must be less than 30 characters'
        );
      });
    });

    describe('pattern', () => {
      it('should have correct pattern regex', () => {
        expect(USERNAME_VALIDATION.pattern.value).toEqual(/^[a-zA-Z0-9_-]+$/);
        expect(USERNAME_VALIDATION.pattern.message).toBe(
          'Username can only contain letters, numbers, underscores, and hyphens'
        );
      });

      it('should match valid usernames', () => {
        const pattern = USERNAME_VALIDATION.pattern.value;
        expect(pattern.test('username123')).toBe(true);
        expect(pattern.test('user_name')).toBe(true);
        expect(pattern.test('user-name')).toBe(true);
        expect(pattern.test('User123')).toBe(true);
      });

      it('should not match invalid usernames', () => {
        const pattern = USERNAME_VALIDATION.pattern.value;
        expect(pattern.test('user name')).toBe(false); // space
        expect(pattern.test('user@name')).toBe(false); // special char
        expect(pattern.test('user.name')).toBe(false); // dot
        expect(pattern.test('user!name')).toBe(false); // exclamation
      });
    });
  });
});
