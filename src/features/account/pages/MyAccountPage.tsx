import { useAuthStore } from '@features/auth/store/authStore';
import ProfileHeader from '@features/account/components/ProfileHeader';
import ProfileCard from '@features/account/components/ProfileCard';
import ProfileEditSection from '@features/account/components/ProfileEditSection';
import { useMyAccount } from '@features/account/hooks/useMyAccount';
import { LoadingSpinner, ConfirmModal } from '@shared/components/feedback';

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
    confirmModal,
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        onConfirm={confirmModal.handleConfirm}
        onCancel={confirmModal.handleCancel}
        isLoading={confirmModal.isLoading}
      />
    </section>
  );
}
