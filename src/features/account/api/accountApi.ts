import apiClient from '@shared/api/client';
import { handleApiError, createApiError } from '@shared/utils/errorHandler';
import type { User } from '@features/auth/types';
import type { DeleteAccountResponse, UserStatisticsResponse } from '@features/account/types';
import type { UserWithStats } from '@features/users/types';

const ME_ENDPOINT = '/me';
const PASSWORD_ENDPOINT = '/me/password';

export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  try {
    const response = await apiClient.delete<DeleteAccountResponse>(ME_ENDPOINT);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const updateUsername = async (username: string): Promise<User> => {
  try {
    const response = await apiClient.patch<{ data: User } | User>(ME_ENDPOINT, { username });
    const user =
      response.data && typeof response.data === 'object' && 'data' in response.data
        ? (response.data as { data: User }).data
        : (response.data as User);
    return user;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const updatePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  try {
    await apiClient.patch(PASSWORD_ENDPOINT, { oldPassword, newPassword });
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getUserStatistics = async (userId: number): Promise<UserWithStats> => {
  try {
    const response = await apiClient.get<UserStatisticsResponse>(`/users/${userId}/statistic`);
    const data = response.data.data;
    const statistic = data.statistic;

    return {
      user: {
        id: data.id,
        username: data.username,
        role: data.role,
      },
      stats: {
        rating: statistic.rating,
        snippets: statistic.snippetsCount,
        comments: statistic.commentsCount,
        likes: statistic.likesCount,
        dislikes: statistic.dislikesCount,
        questions: statistic.questionsCount,
        correctAnswers: statistic.correctAnswersCount,
        regularAnswers: statistic.regularAnswersCount,
      },
    };
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
