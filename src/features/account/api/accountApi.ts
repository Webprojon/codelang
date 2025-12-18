import apiClient from '@shared/api/client';
import type { User } from '@features/auth/types';
import type { DeleteAccountResponse } from '@features/account/types';

const ME_ENDPOINT = '/me';
const PASSWORD_ENDPOINT = '/me/password';

export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  const response = await apiClient.delete<DeleteAccountResponse>(ME_ENDPOINT);
  return response.data;
};

export const updateUsername = async (username: string): Promise<User> => {
  const response = await apiClient.patch<{ data: User } | User>(ME_ENDPOINT, { username });
  const user =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as { data: User }).data
      : (response.data as User);
  return user;
};

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await apiClient.patch(PASSWORD_ENDPOINT, { oldPassword, newPassword });
};
