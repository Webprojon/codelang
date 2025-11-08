import type { User } from '../auth/types';
import type { PaginationMeta } from '@shared/types/api';

// Domain Types
export interface Question {
  id: number;
  title: string;
  description: string;
  attachedCode?: string;
  user: User;
  answers: Answer[];
  isResolved: boolean;
}

export interface Answer {
  id: number;
  content: string;
  user: User;
  createdAt?: string;
}

export interface QuestionsResponse {
  questions: Question[];
  meta: PaginationMeta;
}

// API Types
export interface ApiQuestion {
  id: number;
  title: string;
  description: string;
  attachedCode: string;
  user: User;
  answers: (ApiAnswer | null)[];
  isResolved?: boolean;
}

export interface ApiAnswer {
  id: number;
  content: string;
  user: User;
  createdAt?: string;
}

export interface ApiPaginationMeta extends PaginationMeta {
  sortBy?: Array<[string, 'ASC' | 'DESC']>;
  searchBy?: string[];
  search?: string;
  select?: string[];
  filter?: Record<string, unknown>;
}

export interface ApiPaginationLinks {
  first: string;
  previous: string;
  current: string;
  next: string;
  last: string;
}

export interface ApiQuestionsResponseData {
  data: ApiQuestion[];
  meta: ApiPaginationMeta;
  links: ApiPaginationLinks;
}

export interface ApiQuestionsResponse {
  data: ApiQuestionsResponseData;
}

// Request Types
export interface CreateQuestionRequest {
  title: string;
  description: string;
  attachedCode: string;
}

export interface UpdateQuestionRequest {
  title: string;
  description: string;
  attachedCode: string;
}

export interface QuestionFormData {
  title: string;
  description: string;
  attachedCode: string;
}

// Hook Return Types
export interface UseQuestionsReturn {
  questions: Question[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  refetch: () => Promise<unknown>;
}

export interface UseCreateQuestionReturn {
  isSubmitting: boolean;
  error: string | null;
  createQuestion: (request: CreateQuestionRequest) => Promise<void>;
}

export interface UseUpdateQuestionReturn {
  isUpdating: boolean;
  error: string | null;
  updateQuestion: (id: number, request: UpdateQuestionRequest) => Promise<Question>;
}

export interface UseDeleteQuestionReturn {
  isDeleting: boolean;
  error: string | null;
  deleteQuestion: (id: number) => Promise<void>;
}

// Answer Request Types
export interface CreateAnswerRequest {
  content: string;
  questionId: number;
}

export interface UpdateAnswerRequest {
  content: string;
}

export interface AnswerFormData {
  content: string;
}

// Answer Hook Return Types
export interface UseCreateAnswerReturn {
  isSubmitting: boolean;
  error: string | null;
  createAnswer: (request: CreateAnswerRequest) => Promise<void>;
}

export interface UseUpdateAnswerReturn {
  isUpdating: boolean;
  error: string | null;
  updateAnswer: (id: number, questionId: number, request: UpdateAnswerRequest) => Promise<void>;
}

export interface UseDeleteAnswerReturn {
  isDeleting: boolean;
  error: string | null;
  deleteAnswer: (id: number, questionId: number) => Promise<void>;
}
