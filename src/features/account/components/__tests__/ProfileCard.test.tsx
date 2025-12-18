import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../__tests__/test-utils';
import ProfileCard from '../ProfileCard';
import type { User } from '@features/auth/types';
import type { UserStats } from '@features/account/types';

describe('ProfileCard', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    role: 'user',
  };

  const mockStats: UserStats = {
    rating: 100,
    snippets: 5,
    comments: 10,
    likes: 20,
    dislikes: 2,
    questions: 3,
    correctAnswers: 2,
    regularAnswers: 1,
  };

  it('should render user information correctly', () => {
    render(<ProfileCard user={mockUser} stats={mockStats} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Id: 1')).toBeInTheDocument();
    expect(screen.getByText('Role: user')).toBeInTheDocument();
  });

  it('should render user stats correctly', () => {
    render(<ProfileCard user={mockUser} stats={mockStats} />);

    expect(screen.getByText(/Rating:/i)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/Snippets:/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onLogout when logout button is clicked', async () => {
    const onLogout = jest.fn();
    const user = userEvent.setup();

    render(<ProfileCard user={mockUser} stats={mockStats} onLogout={onLogout} />);

    const logoutButton = screen.getByLabelText('Logout');
    await user.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteAccount when delete button is clicked', async () => {
    const onDeleteAccount = jest.fn();
    const user = userEvent.setup();

    render(<ProfileCard user={mockUser} stats={mockStats} onDeleteAccount={onDeleteAccount} />);

    const deleteButton = screen.getByLabelText('Delete account');
    await user.click(deleteButton);

    expect(onDeleteAccount).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers when they are not provided', async () => {
    const user = userEvent.setup();

    render(<ProfileCard user={mockUser} stats={mockStats} />);

    const logoutButton = screen.getByLabelText('Logout');
    const deleteButton = screen.getByLabelText('Delete account');

    await user.click(logoutButton);
    await user.click(deleteButton);

    // Should not throw errors
    expect(logoutButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should render profile picture placeholder', () => {
    render(<ProfileCard user={mockUser} stats={mockStats} />);

    const profilePicture = screen.getByLabelText('Profile picture');
    expect(profilePicture).toBeInTheDocument();
  });
});
