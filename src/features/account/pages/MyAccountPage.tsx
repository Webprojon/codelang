import { useAuthStore } from '../../auth/store/authStore';
import ProfileHeader from '../components/ProfileHeader';
import ProfileCard from '../components/ProfileCard';
import ProfileEditSection from '../components/ProfileEditSection';
import type {
  ChangeUsernameFormData,
  ChangePasswordFormData,
  UserStats as UserStatsType,
} from '../types';

export default function MyAccountPage() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const stats: UserStatsType = {
    rating: 1,
    snippets: 1,
    comments: 0,
    likes: 0,
    dislikes: 0,
    questions: 0,
    correctAnswers: 0,
    regularAnswers: 0,
  };

  if (!user) {
    return null;
  }

  const handleSaveUsername = (data: ChangeUsernameFormData) => {
    // TODO: Implement username change
    console.log('Saving username:', data.newUsername);
  };

  const handleChangePassword = (data: ChangePasswordFormData) => {
    // TODO: Implement password change
    console.log('Changing password', { oldPassword: data.oldPassword });
  };

  const handleLogout = () => {
    // TODO: Add confirmation dialog
    logout();
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    console.log('Delete account');
  };

  return (
    <section className="min-h-screen bg-white px-4 md:px-6 lg:px-8">
      <ProfileHeader username={user.username} />

      <ProfileCard
        user={user}
        stats={stats}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      <ProfileEditSection
        onUsernameChange={handleSaveUsername}
        onPasswordChange={handleChangePassword}
      />
    </section>
  );
}
