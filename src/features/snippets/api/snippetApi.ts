import apiClient from '@shared/api/client';
import { useAuthStore } from '@features/auth/store/authStore';
import { transformApiSnippetToSnippet as transformSnippet } from '@features/snippets/utils/snippetUtils';
import { transformPaginatedResponseWithContext } from '@shared/utils/apiUtils';
import type {
  SnippetsResponse,
  PostSnippetRequest,
  UpdateSnippetRequest,
  ApiSnippet,
  ApiResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '@features/snippets/types';
import { MarkType } from '@features/snippets/types';
import { SNIPPETS_ENDPOINT, DEFAULT_SORT_BY } from '@features/snippets/constants';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';

export const getSnippets = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<SnippetsResponse> => {
  const state = useAuthStore.getState();
  const currentUserId = state.user?.id;

  const response = await apiClient.get<ApiResponse>(SNIPPETS_ENDPOINT, {
    params: {
      page,
      limit,
      sortBy: DEFAULT_SORT_BY,
    },
  });

  const { items, meta } = transformPaginatedResponseWithContext(
    response.data.data,
    transformSnippet,
    currentUserId
  );

  return {
    snippets: items,
    meta,
  };
};

export const createSnippet = async (request: PostSnippetRequest): Promise<void> => {
  await apiClient.post(SNIPPETS_ENDPOINT, request);
};

export const markSnippet = async (id: number, mark: MarkType): Promise<void> => {
  await apiClient.post(`${SNIPPETS_ENDPOINT}/${id}/mark`, { mark });
};

export const getSnippetById = async (id: number): Promise<ApiSnippet> => {
  const response = await apiClient.get<{ data: ApiSnippet }>(`${SNIPPETS_ENDPOINT}/${id}`);
  return response.data.data;
};

export const updateSnippet = async (
  id: number,
  request: UpdateSnippetRequest
): Promise<ApiSnippet> => {
  const response = await apiClient.patch<{ data: ApiSnippet }>(
    `${SNIPPETS_ENDPOINT}/${id}`,
    request
  );
  return response.data.data;
};

export const deleteSnippet = async (id: number): Promise<void> => {
  await apiClient.delete(`${SNIPPETS_ENDPOINT}/${id}`);
};

export const getMySnippets = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<SnippetsResponse> => {
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

  const { items, meta } = transformPaginatedResponseWithContext(
    response.data.data,
    transformSnippet,
    currentUserId
  );

  return {
    snippets: items,
    meta,
  };
};

const COMMENTS_ENDPOINT = '/comments' as const;

export const createComment = async (
  request: CreateCommentRequest
): Promise<CreateCommentResponse> => {
  const response = await apiClient.post<{ data: CreateCommentResponse }>(
    COMMENTS_ENDPOINT,
    request
  );
  return response.data.data;
};

export const updateComment = async (
  id: number,
  request: UpdateCommentRequest
): Promise<UpdateCommentResponse> => {
  const response = await apiClient.patch<UpdateCommentResponse>(
    `${COMMENTS_ENDPOINT}/${id}`,
    request
  );
  return response.data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await apiClient.delete(`${COMMENTS_ENDPOINT}/${id}`);
};

export const getLanguages = async (): Promise<string[]> => {
  const response = await apiClient.get<{ data: string[] }>(`${SNIPPETS_ENDPOINT}/languages`);
  return response.data.data;
};
