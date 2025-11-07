import apiClient from '../../../shared/api/client';
import { handleApiError, createApiError } from '../../../shared/utils/errorHandler';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  User,
} from '../types';

const REGISTER_ENDPOINT = '/register';
const LOGIN_ENDPOINT = '/auth/login';
const LOGOUT_ENDPOINT = '/auth/logout';
const ME_ENDPOINT = '/me';

export const registerUser = async (credentials: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(REGISTER_ENDPOINT, credentials);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(LOGIN_ENDPOINT, credentials);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post(LOGOUT_ENDPOINT, {});
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<{ data: User }>(ME_ENDPOINT);
    const user = response.data?.data ?? response.data;
    return user;
  } catch (error) {
    const apiError = handleApiError(error);
    throw createApiError(apiError);
  }
};
