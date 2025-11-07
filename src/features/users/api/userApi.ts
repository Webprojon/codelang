import apiClient from '../../../shared/api/client';
import { handleApiError, createApiError } from '../../../shared/utils/errorHandler';
import type { PaginationMeta } from '@shared/types/api';
import type { User } from '../../auth/types';
import type { UserStatisticsResponse } from '../../account/types';
import type { UserWithStats } from '../types';

const USERS_ENDPOINT = '/users';
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 15;

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

const DEFAULT_META: PaginationMeta = {
  itemsPerPage: 0,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};

const parseUsersResponse = (
  responseData: ApiUsersResponse | { data: User[] } | User[]
): { users: User[]; meta?: PaginationMeta } => {
  if (responseData && 'data' in responseData) {
    const apiResponse = responseData as ApiUsersResponse;
    if (apiResponse.data && 'data' in apiResponse.data && 'meta' in apiResponse.data) {
      return {
        users: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    }
  }

  if (Array.isArray(responseData)) {
    return {
      users: responseData,
      meta: DEFAULT_META,
    };
  }

  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    const data = (responseData as { data: User[] }).data;
    if (Array.isArray(data)) {
      return {
        users: data,
        meta: DEFAULT_META,
      };
    }
  }

  return {
    users: [],
    meta: DEFAULT_META,
  };
};

export const getUsers = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<UsersResponse> => {
  try {
    const response = await apiClient.get<ApiUsersResponse | { data: User[] }>(USERS_ENDPOINT, {
      params: {
        page,
        limit,
      },
    });

    const { users, meta } = parseUsersResponse(response.data);
    return {
      users,
      meta: meta || DEFAULT_META,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await apiClient.get<UserResponse | { data: User }>(`${USERS_ENDPOINT}/${id}`);

    if (response.data && 'data' in response.data) {
      return response.data.data;
    }

    return response.data as User;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getUserStatistics = async (userId: number): Promise<UserWithStats> => {
  try {
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
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
