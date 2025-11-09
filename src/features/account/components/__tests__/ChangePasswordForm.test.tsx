import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../__tests__/test-utils';
import ChangePasswordForm from '../ChangePasswordForm';

describe('ChangePasswordForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Old password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('should validate old password is required', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const oldPasswordInput = screen.getByPlaceholderText('Old password');
    await user.type(oldPasswordInput, 'oldpass123');
    await user.clear(oldPasswordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Old password is required')).toBeInTheDocument();
    });
  });

  it('should validate new password requirements', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const newPasswordInput = screen.getByPlaceholderText('New password');

    // Test min length
    await user.type(newPasswordInput, '12345');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });

    await user.clear(newPasswordInput);

    // Test has letter
    await user.type(newPasswordInput, '123456');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one letter')).toBeInTheDocument();
    });

    await user.clear(newPasswordInput);

    // Test has number
    await user.type(newPasswordInput, 'password');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
    });
  });

  it('should validate confirm password matches', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const newPasswordInput = screen.getByPlaceholderText('New password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

    await user.type(newPasswordInput, 'newpass123');
    await user.type(confirmPasswordInput, 'different123');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data on valid form submission', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const oldPasswordInput = screen.getByPlaceholderText('Old password');
    const newPasswordInput = screen.getByPlaceholderText('New password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /change password/i });

    await user.type(oldPasswordInput, 'oldpass123');
    await user.type(newPasswordInput, 'newpass123');
    await user.type(confirmPasswordInput, 'newpass123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        oldPassword: 'oldpass123',
        newPassword: 'newpass123',
        confirmPassword: 'newpass123',
      });
    });
  });

  it('should disable button when isLoading is true', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /changing password.../i });
    expect(submitButton).toBeDisabled();
  });

  it('should disable inputs when submitting', () => {
    render(<ChangePasswordForm onSubmit={mockOnSubmit} isLoading={true} />);

    const oldPasswordInput = screen.getByPlaceholderText('Old password');
    const newPasswordInput = screen.getByPlaceholderText('New password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

    expect(oldPasswordInput).toBeDisabled();
    expect(newPasswordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

    const oldPasswordInput = screen.getByPlaceholderText('Old password');
    const newPasswordInput = screen.getByPlaceholderText('New password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /change password/i });

    await user.type(oldPasswordInput, 'oldpass123');
    await user.type(newPasswordInput, 'newpass123');
    await user.type(confirmPasswordInput, 'newpass123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset
    expect(oldPasswordInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
  });
});
