import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../__tests__/test-utils';
import ChangeUsernameForm from '../ChangeUsernameForm';

describe('ChangeUsernameForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form correctly', () => {
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Change your username:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should validate username is required', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    await user.type(usernameInput, 'test');
    await user.clear(usernameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });
  });

  it('should validate username min length', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    await user.type(usernameInput, 'test');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText('Username must be longer than or equal to 5 characters')
      ).toBeInTheDocument();
    });
  });

  it('should validate username max length', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    const longUsername = 'a'.repeat(31);
    await user.type(usernameInput, longUsername);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Username must be less than 30 characters')).toBeInTheDocument();
    });
  });

  it('should validate username pattern (only letters, numbers, underscores, hyphens)', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    await user.type(usernameInput, 'test@user');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText('Username can only contain letters, numbers, underscores, and hyphens')
      ).toBeInTheDocument();
    });
  });

  it('should accept valid username with underscores and hyphens', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    await user.type(usernameInput, 'test_user-123');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.queryByText('Username can only contain letters, numbers, underscores, and hyphens')
      ).not.toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data on valid form submission', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await user.type(usernameInput, 'newusername');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        newUsername: 'newusername',
      });
    });
  });

  it('should disable button when isLoading is true', () => {
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /saving.../i });
    expect(submitButton).toBeDisabled();
  });

  it('should disable input when submitting', () => {
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} isLoading={true} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    expect(usernameInput).toBeDisabled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    const submitButton = screen.getByRole('button', { name: /save/i });

    await user.type(usernameInput, 'newusername');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset
    expect(usernameInput).toHaveValue('');
  });

  it('should not call onSubmit when isLoading is true', async () => {
    const user = userEvent.setup();
    render(<ChangeUsernameForm onSubmit={mockOnSubmit} isLoading={true} />);

    const usernameInput = screen.getByPlaceholderText('New username');
    const submitButton = screen.getByRole('button', { name: /saving.../i });

    await user.type(usernameInput, 'newusername');
    await user.click(submitButton);

    // Should not call onSubmit when isLoading is true
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
