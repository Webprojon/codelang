import apiClient from '../../../shared/services/apiClient';
import { handleApiError, createApiError } from '../../../shared/utils/errorHandler';
import { useAuthStore } from '../../../features/auth/store/authStore';
import type {
  Snippet,
  SnippetsResponse,
  PostSnippetRequest,
  ApiSnippet,
  ApiResponse,
  ApiPaginationMeta,
} from '../types';
import { SNIPPETS_ENDPOINT, DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_SORT_BY } from '../constants';

const DEFAULT_META: ApiPaginationMeta = {
  itemsPerPage: 0,
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};

const transformApiSnippetToSnippet = (apiSnippet: ApiSnippet, currentUserId?: number): Snippet => {
  const likes = apiSnippet.marks.filter(mark => mark.type === 'like').length;
  const dislikes = apiSnippet.marks.filter(mark => mark.type === 'dislike').length;
  const commentsCount = apiSnippet.comments.length;

  let currentUserMark: 'like' | 'dislike' | null = null;
  if (currentUserId !== undefined) {
    const userMark = apiSnippet.marks.find(
      mark =>
        parseInt(mark.user.id, 10) === currentUserId || mark.user.id === currentUserId.toString()
    );
    if (userMark) {
      currentUserMark = userMark.type;
    }
  }

  return {
    id: parseInt(apiSnippet.id, 10),
    title: '',
    content: apiSnippet.code,
    language: apiSnippet.language.toLowerCase(),
    createdAt: new Date().toISOString(),
    username: apiSnippet.user.username,
    likes,
    dislikes,
    comments: commentsCount,
    currentUserMark,
  };
};

const transformApiResponse = (
  apiResponse: ApiResponse,
  currentUserId?: number
): SnippetsResponse => {
  const responseData = apiResponse.data;
  const apiSnippets = responseData?.data || [];
  const meta = responseData?.meta || DEFAULT_META;

  const snippets = apiSnippets.map(apiSnippet =>
    transformApiSnippetToSnippet(apiSnippet, currentUserId)
  );

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

export const markSnippet = async (id: number, mark: 'like' | 'dislike'): Promise<void> => {
  try {
    await apiClient.post(`${SNIPPETS_ENDPOINT}/${id}/mark`, { mark });
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
