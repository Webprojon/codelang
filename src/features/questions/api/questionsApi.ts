import apiClient from '@shared/api/client';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@shared/constants';
import { transformPaginatedResponse } from '@shared/utils/apiUtils';
import type {
  ApiQuestionsResponse,
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

export const getQuestions = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): Promise<QuestionsResponse> => {
  const response = await apiClient.get<ApiQuestionsResponse>(QUESTIONS_ENDPOINT, {
    params: {
      page,
      limit,
    },
  });

  const { items, meta } = transformPaginatedResponse(response.data, transformApiQuestion);
  return {
    questions: items,
    meta,
  };
};

export const getQuestionById = async (id: number): Promise<Question> => {
  const response = await apiClient.get<{ data: ApiQuestion }>(`${QUESTIONS_ENDPOINT}/${id}`);
  return transformApiQuestion(response.data.data);
};

export const createQuestion = async (request: CreateQuestionRequest): Promise<Question> => {
  const response = await apiClient.post<{ data: ApiQuestion }>(QUESTIONS_ENDPOINT, request);
  return transformApiQuestion(response.data.data);
};

export const updateQuestion = async (
  id: number,
  request: UpdateQuestionRequest
): Promise<Question> => {
  const response = await apiClient.patch<{ data: ApiQuestion }>(
    `${QUESTIONS_ENDPOINT}/${id}`,
    request
  );
  return transformApiQuestion(response.data.data);
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await apiClient.delete(`${QUESTIONS_ENDPOINT}/${id}`);
};
