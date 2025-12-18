import apiClient from '@shared/api/client';
import { DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_META } from '@shared/constants';
import { transformPaginatedResponse } from '@shared/utils/apiUtils';
import type { PaginationMeta } from '@shared/types/api';
import type { User } from '@features/auth/types';
import type { UserStatisticsResponse } from '@features/account/types';
import type { UserWithStats } from '@features/users/types';

const USERS_ENDPOINT = '/users';

export interface UsersResponse {
  users: User[];
  meta: PaginationMeta;
}

export interface ApiUsersResponse {
  data: {
    data: User[];
    meta: PaginationMeta;
  };
}

export interface UserResponse {
  data: User;
}

export const getUsers = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<UsersResponse> => {
  const response = await apiClient.get<ApiUsersResponse | { data: User[] }>(USERS_ENDPOINT, {
    params: {
      page,
      limit,
    },
  });

  if (Array.isArray(response.data)) {
    return {
      users: response.data,
      meta: DEFAULT_META,
    };
  }

  if (response.data && 'data' in response.data) {
    const apiResponse = response.data as ApiUsersResponse;
    if (apiResponse.data && 'data' in apiResponse.data && 'meta' in apiResponse.data) {
      const { items, meta } = transformPaginatedResponse(apiResponse, (user: User) => user);
      return {
        users: items,
        meta,
      };
    }

    // Handle simple nested: { data: User[] }
    if (Array.isArray(apiResponse.data)) {
      return {
        users: apiResponse.data,
        meta: DEFAULT_META,
      };
    }
  }

  return {
    users: [],
    meta: DEFAULT_META,
  };
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<UserResponse | { data: User }>(`${USERS_ENDPOINT}/${id}`);

  if (response.data && 'data' in response.data) {
    return response.data.data;
  }

  return response.data as unknown as User;
};

export const getUserStatistics = async (userId: number): Promise<UserWithStats> => {
  const response = await apiClient.get<UserStatisticsResponse>(
    `${USERS_ENDPOINT}/${userId}/statistic`
  );
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
};
