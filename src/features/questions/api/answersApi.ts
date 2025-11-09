import apiClient from '@shared/api/client';
import { handleApiError, createApiError } from '@shared/utils/errorHandler';
import type {
  Answer,
  ApiAnswer,
  CreateAnswerRequest,
  UpdateAnswerRequest,
} from '@features/questions/types';

const ANSWERS_ENDPOINT = '/answers' as const;

const transformApiAnswer = (apiAnswer: ApiAnswer): Answer => {
  return {
    id: apiAnswer.id,
    content: apiAnswer.content,
    user: apiAnswer.user,
    createdAt: apiAnswer.createdAt,
  };
};

export const createAnswer = async (request: CreateAnswerRequest): Promise<Answer> => {
  try {
    const response = await apiClient.post<{ data: ApiAnswer }>(ANSWERS_ENDPOINT, request);
    return transformApiAnswer(response.data.data);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const updateAnswer = async (id: number, request: UpdateAnswerRequest): Promise<Answer> => {
  try {
    const response = await apiClient.patch<{ data: ApiAnswer }>(
      `${ANSWERS_ENDPOINT}/${id}`,
      request
    );
    return transformApiAnswer(response.data.data);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const deleteAnswer = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${ANSWERS_ENDPOINT}/${id}`);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
