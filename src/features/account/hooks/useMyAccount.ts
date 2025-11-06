import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../auth/store/authStore';
import {
  deleteAccount,
  updateUsername,
  updatePassword,
  getUserStatistics,
} from '../services/accountService';
import { logoutUser } from '../../auth/services/authService';
import type { ChangeUsernameFormData, ChangePasswordFormData } from '../types';
import { useConfirmModal } from '../../../shared/hooks/useConfirmModal';

export const useMyAccount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const setUser = useAuthStore(state => state.setUser);
  const confirmModal = useConfirmModal();

  const { data: userWithStats, isLoading } = useQuery({
    queryKey: ['userStatistics', user?.id],
    queryFn: () => getUserStatistics(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (userWithStats?.user) {
      setUser(userWithStats.user);
    }
  }, [userWithStats?.user, setUser]);

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    },
    onError: error => {
      toast.error('Failed to delete account. Please try again.');
      console.error('Failed to delete account:', error);
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: (username: string) => updateUsername(username),
    onSuccess: updatedUser => {
      const newUser = user
        ? {
            id: updatedUser.id ?? user.id,
            username: updatedUser.username,
            role: updatedUser.role ?? user.role,
          }
        : updatedUser;
      setUser(newUser);
      queryClient.invalidateQueries({ queryKey: ['userStatistics', user?.id] });
      toast.success('Username successfully changed');
    },
    onError: error => {
      console.error('Failed to update username:', error);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      updatePassword(oldPassword, newPassword),
    onSuccess: () => {
      toast.success('Password successfully changed');
    },
    onError: error => {
      console.error('Failed to update password:', error);
    },
  });

  const handleSaveUsername = (data: ChangeUsernameFormData) => {
    const trimmedUsername = data.newUsername.trim();
    updateUsernameMutation.mutate(trimmedUsername);
  };

  const handleChangePassword = (data: ChangePasswordFormData) => {
    updatePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    confirmModal.showConfirm('Are you sure you want to delete your account?', () => {
      deleteAccountMutation.mutate();
    });
  };

  return {
    userWithStats,
    isLoading,
    handleSaveUsername,
    handleChangePassword,
    handleLogout,
    handleDeleteAccount,
    isSavingUsername: updateUsernameMutation.isPending,
    isChangingPassword: updatePasswordMutation.isPending,
    confirmModal,
  };
};
