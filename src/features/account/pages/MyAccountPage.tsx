import { useAuthStore } from '../../auth/store/authStore';
import ProfileHeader from '../components/ProfileHeader';
import ProfileCard from '../components/ProfileCard';
import ProfileEditSection from '../components/ProfileEditSection';
import { useMyAccount } from '../hooks/useMyAccount';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

export default function MyAccountPage() {
  const user = useAuthStore(state => state.user);
  const {
    userWithStats,
    isLoading,
    handleSaveUsername,
    handleChangePassword,
    handleLogout,
    handleDeleteAccount,
    isSavingUsername,
    isChangingPassword,
  } = useMyAccount();

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="min-h-screen bg-white px-4 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </section>
    );
  }

  if (!userWithStats) {
    return null;
  }

  return (
    <section className="min-h-screen bg-white">
      <ProfileHeader user={userWithStats.user} />

      <ProfileCard
        user={userWithStats.user}
        stats={userWithStats.stats}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      <ProfileEditSection
        onUsernameChange={handleSaveUsername}
        onPasswordChange={handleChangePassword}
        isSavingUsername={isSavingUsername}
        isChangingPassword={isChangingPassword}
      />
    </section>
  );
}
