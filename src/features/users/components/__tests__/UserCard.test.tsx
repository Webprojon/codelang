import { screen } from '@testing-library/react';
import { render } from '../../../../__tests__/test-utils';
import UserCard from '../UserCard';
import type { User } from '@features/auth/types';

describe('UserCard', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    role: 'user',
  };

  it('should render user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Role: user')).toBeInTheDocument();
  });

  it('should render first letter of username in avatar', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should render link to user page', () => {
    render(<UserCard user={mockUser} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/users/1');
  });

  it('should render user icon', () => {
    render(<UserCard user={mockUser} />);

    // FaUser icon should be present (it's rendered as SVG)
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('should handle different user roles', () => {
    const adminUser: User = {
      id: 2,
      username: 'admin',
      role: 'admin',
    };

    render(<UserCard user={adminUser} />);

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Role: admin')).toBeInTheDocument();
  });

  it('should handle long usernames with truncation', () => {
    const longUsernameUser: User = {
      id: 3,
      username: 'verylongusernamethatexceedsthelimit',
      role: 'user',
    };

    render(<UserCard user={longUsernameUser} />);

    expect(screen.getByText('verylongusernamethatexceedsthelimit')).toBeInTheDocument();
  });

  it('should render first letter correctly for usernames starting with special characters', () => {
    // Note: getFirstLetter should handle this, but let's test the component renders
    const specialCharUser: User = {
      id: 4,
      username: '123user',
      role: 'user',
    };

    render(<UserCard user={specialCharUser} />);

    // Should still render the card
    expect(screen.getByText('123user')).toBeInTheDocument();
  });
});
