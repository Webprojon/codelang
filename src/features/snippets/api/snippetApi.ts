import apiClient from '@shared/api/client';
import { handleApiError, createApiError } from '@shared/utils/errorHandler';
import { useAuthStore } from '@features/auth/store/authStore';
import { transformApiSnippetToSnippet as transformSnippet } from '../utils/snippetUtils';
import type {
  SnippetsResponse,
  PostSnippetRequest,
  UpdateSnippetRequest,
  ApiSnippet,
  ApiResponse,
  ApiPaginationMeta,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '../types';
import { MarkType } from '../types';
import { SNIPPETS_ENDPOINT, DEFAULT_SORT_BY } from '../constants';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';

const DEFAULT_META: ApiPaginationMeta = {
  itemsPerPage: 0,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};

const transformApiResponse = (
  apiResponse: ApiResponse,
  currentUserId?: number
): SnippetsResponse => {
  const responseData = apiResponse.data;
  const apiSnippets = responseData?.data || [];
  const meta = responseData?.meta || DEFAULT_META;

  const snippets = apiSnippets.map(apiSnippet => transformSnippet(apiSnippet, currentUserId));

  return {
    snippets,
    meta: {
      itemsPerPage: meta.itemsPerPage,
      totalItems: meta.totalItems,
      currentPage: meta.currentPage,
      totalPages: meta.totalPages,
    },
  };
};

export const getSnippets = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<SnippetsResponse> => {
  try {
    const state = useAuthStore.getState();
    const currentUserId = state.user?.id;

    const response = await apiClient.get<ApiResponse>(SNIPPETS_ENDPOINT, {
      params: {
        page,
        limit,
        sortBy: DEFAULT_SORT_BY,
      },
    });

    return transformApiResponse(response.data as ApiResponse, currentUserId);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const createSnippet = async (request: PostSnippetRequest): Promise<void> => {
  try {
    await apiClient.post(SNIPPETS_ENDPOINT, request);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const markSnippet = async (id: number, mark: MarkType): Promise<void> => {
  try {
    await apiClient.post(`${SNIPPETS_ENDPOINT}/${id}/mark`, { mark });
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getSnippetById = async (id: number): Promise<ApiSnippet> => {
  try {
    const response = await apiClient.get<{ data: ApiSnippet }>(`${SNIPPETS_ENDPOINT}/${id}`);
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const updateSnippet = async (
  id: number,
  request: UpdateSnippetRequest
): Promise<ApiSnippet> => {
  try {
    const response = await apiClient.patch<{ data: ApiSnippet }>(
      `${SNIPPETS_ENDPOINT}/${id}`,
      request
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const deleteSnippet = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${SNIPPETS_ENDPOINT}/${id}`);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getMySnippets = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<SnippetsResponse> => {
  try {
    const state = useAuthStore.getState();
    const currentUserId = state.user?.id;

    const response = await apiClient.get<ApiResponse>(SNIPPETS_ENDPOINT, {
      params: {
        page,
        limit,
        sortBy: DEFAULT_SORT_BY,
        userId: currentUserId,
      },
    });

    return transformApiResponse(response.data as ApiResponse, currentUserId);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

const COMMENTS_ENDPOINT = '/comments' as const;

export const createComment = async (
  request: CreateCommentRequest
): Promise<CreateCommentResponse> => {
  try {
    const response = await apiClient.post<{ data: CreateCommentResponse }>(
      COMMENTS_ENDPOINT,
      request
    );
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const updateComment = async (
  id: number,
  request: UpdateCommentRequest
): Promise<UpdateCommentResponse> => {
  try {
    const response = await apiClient.patch<UpdateCommentResponse>(
      `${COMMENTS_ENDPOINT}/${id}`,
      request
    );
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const deleteComment = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${COMMENTS_ENDPOINT}/${id}`);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getLanguages = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<{ data: string[] }>(`${SNIPPETS_ENDPOINT}/languages`);
    return response.data.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
