import apiClient from '@shared/api/client';
import { handleApiError, createApiError } from '@shared/utils/errorHandler';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import type {
  ApiQuestionsResponse,
  ApiQuestionsResponseData,
  QuestionsResponse,
  Question,
  ApiQuestion,
  Answer,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '@features/questions/types';

const QUESTIONS_ENDPOINT = '/questions' as const;

const transformApiQuestion = (apiQuestion: ApiQuestion): Question => {
  return {
    id: apiQuestion.id,
    title: apiQuestion.title,
    description: apiQuestion.description,
    attachedCode: apiQuestion.attachedCode || undefined,
    user: apiQuestion.user,
    answers: (apiQuestion.answers || []).filter((answer): answer is Answer => answer !== null),
    isResolved: apiQuestion.isResolved ?? false,
  };
};

const transformApiResponse = (
  apiResponse: ApiQuestionsResponse | ApiQuestionsResponseData
): QuestionsResponse => {
  let responseData: ApiQuestionsResponseData;

  if (
    'data' in apiResponse &&
    apiResponse.data &&
    typeof apiResponse.data === 'object' &&
    'data' in apiResponse.data
  ) {
    responseData = apiResponse.data as ApiQuestionsResponseData;
  } else {
    responseData = apiResponse as ApiQuestionsResponseData;
  }

  const questions = (responseData?.data || []).map(transformApiQuestion);
  const meta = responseData?.meta || {
    itemsPerPage: 0,
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  };

  return {
    questions,
    meta: {
      itemsPerPage: meta.itemsPerPage,
      totalItems: meta.totalItems,
      currentPage: meta.currentPage,
      totalPages: meta.totalPages,
    },
  };
};

export const getQuestions = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<QuestionsResponse> => {
  try {
    const response = await apiClient.get<ApiQuestionsResponse>(QUESTIONS_ENDPOINT, {
      params: {
        page,
        limit,
      },
    });

    return transformApiResponse(response.data);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getQuestionById = async (id: number): Promise<Question> => {
  try {
    const response = await apiClient.get<{ data: ApiQuestion }>(`${QUESTIONS_ENDPOINT}/${id}`);
    return transformApiQuestion(response.data.data);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const createQuestion = async (request: CreateQuestionRequest): Promise<Question> => {
  try {
    const response = await apiClient.post<{ data: ApiQuestion }>(QUESTIONS_ENDPOINT, request);
    return transformApiQuestion(response.data.data);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const updateQuestion = async (
  id: number,
  request: UpdateQuestionRequest
): Promise<Question> => {
  try {
    const response = await apiClient.patch<{ data: ApiQuestion }>(
      `${QUESTIONS_ENDPOINT}/${id}`,
      request
    );
    return transformApiQuestion(response.data.data);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const deleteQuestion = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${QUESTIONS_ENDPOINT}/${id}`);
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
